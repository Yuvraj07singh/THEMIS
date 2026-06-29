import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { uploadPdf } from '../middleware/upload.js';
import { HttpError } from '../middleware/errors.js';
import { extractNotice, draftReply } from '../services/ai.js';
import { verifyCitations } from '../services/citationVerifier.js';
import { textToDocx } from '../services/docxExport.js';
import { audit } from '../services/audit.js';

const router = Router();
router.use(requireAuth, requireRole('CA', 'LAWYER'));

/** Ownership guard: the notice's client must belong to the requesting user's firm. */
async function getOwnedNotice(req, id) {
  const notice = await prisma.notice.findUnique({
    where: { id },
    include: { client: true, document: true, reply: true },
  });
  if (!notice || notice.client.firmId !== req.user.firmId) {
    throw new HttpError(404, 'Notice not found');
  }
  return notice;
}

/** List all notices for the firm. */
router.get('/', async (req, res, next) => {
  try {
    const notices = await prisma.notice.findMany({
      where: { client: { firmId: req.user.firmId } },
      include: { client: { select: { id: true, name: true, gstin: true } }, reply: { select: { id: true, reviewedAt: true, exportedAt: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ notices });
  } catch (err) { next(err); }
});

/** Upload a notice PDF for a client and run extraction. */
router.post('/', uploadPdf.single('file'), async (req, res, next) => {
  try {
    const { clientId } = z.object({ clientId: z.string().min(1) }).parse(req.body);
    if (!req.file) throw new HttpError(400, 'Please attach the notice PDF');

    const client = await prisma.client.findFirst({ where: { id: clientId, firmId: req.user.firmId } });
    if (!client) throw new HttpError(404, 'Client not found');

    const document = await prisma.document.create({
      data: {
        ownerId: req.user.id,
        clientId: client.id,
        filename: req.file.originalname,
        path: req.file.path,
        mimeType: req.file.mimetype,
        size: req.file.size,
        kind: 'NOTICE',
      },
    });

    let notice = await prisma.notice.create({
      data: { clientId: client.id, documentId: document.id, status: 'UPLOADED' },
    });
    await audit(req, 'UPLOAD', 'Notice', notice.id, { filename: req.file.originalname, clientId });

    // Extraction — structured facts only
    try {
      const extraction = await extractNotice(req.file.path);
      notice = await prisma.notice.update({
        where: { id: notice.id },
        data: {
          status: 'EXTRACTED',
          noticeType: extraction.noticeType || 'OTHER',
          section: extraction.section,
          period: extraction.period,
          demandAmount: extraction.demandAmount,
          dueDate: extraction.dueDate ? new Date(extraction.dueDate) : null,
          issuedBy: extraction.issuedBy,
          summary: JSON.stringify(extraction),
        },
      });
      await audit(req, 'EXTRACT', 'Notice', notice.id, { noticeType: extraction.noticeType });
    } catch (err) {
      await prisma.notice.update({ where: { id: notice.id }, data: { status: 'FAILED' } });
      throw err;
    }

    res.status(201).json({ notice });
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const notice = await getOwnedNotice(req, req.params.id);
    res.json({ notice });
  } catch (err) { next(err); }
});

/** Draft the reply. Citations are machine-verified against the curated corpus. */
router.post('/:id/draft', async (req, res, next) => {
  try {
    const notice = await getOwnedNotice(req, req.params.id);
    if (notice.status === 'UPLOADED' || notice.status === 'FAILED') {
      throw new HttpError(400, 'Extraction has not completed for this notice');
    }

    const extraction = JSON.parse(notice.summary);
    const result = await draftReply({ extraction, client: notice.client });
    const verification = verifyCitations(result.citations || []);

    const reply = await prisma.reply.upsert({
      where: { noticeId: notice.id },
      create: {
        noticeId: notice.id,
        draftText: result.replyText,
        citationsJson: JSON.stringify(verification.citations),
        verificationJson: JSON.stringify(verification.summary),
      },
      update: {
        draftText: result.replyText,
        citationsJson: JSON.stringify(verification.citations),
        verificationJson: JSON.stringify(verification.summary),
        reviewedById: null,
        reviewedAt: null,
      },
    });

    await prisma.notice.update({ where: { id: notice.id }, data: { status: 'DRAFTED' } });
    await audit(req, 'DRAFT', 'Reply', reply.id, { noticeId: notice.id, citations: verification.summary });

    res.json({ reply, verification: verification.summary });
  } catch (err) { next(err); }
});

/** The professional edits the draft. */
router.put('/:id/reply', async (req, res, next) => {
  try {
    const { draftText } = z.object({ draftText: z.string().min(50, 'Draft is too short') }).parse(req.body);
    const notice = await getOwnedNotice(req, req.params.id);
    if (!notice.reply) throw new HttpError(400, 'No draft exists yet');

    const reply = await prisma.reply.update({
      where: { id: notice.reply.id },
      // Edits invalidate prior approval — the professional must re-approve
      data: { draftText, reviewedById: null, reviewedAt: null },
    });
    await prisma.notice.update({ where: { id: notice.id }, data: { status: 'DRAFTED' } });
    await audit(req, 'UPDATE', 'Reply', reply.id, { noticeId: notice.id });

    res.json({ reply });
  } catch (err) { next(err); }
});

/** Review gate — the professional approves the draft. Required before export. */
router.post('/:id/approve', async (req, res, next) => {
  try {
    const notice = await getOwnedNotice(req, req.params.id);
    if (!notice.reply) throw new HttpError(400, 'No draft exists yet');

    const reply = await prisma.reply.update({
      where: { id: notice.reply.id },
      data: { reviewedById: req.user.id, reviewedAt: new Date() },
    });
    await prisma.notice.update({ where: { id: notice.id }, data: { status: 'APPROVED' } });
    await audit(req, 'APPROVE', 'Reply', reply.id, { noticeId: notice.id });

    res.json({ reply });
  } catch (err) { next(err); }
});

/** Export as DOCX — blocked until the review gate has been passed. */
router.get('/:id/export', async (req, res, next) => {
  try {
    const notice = await getOwnedNotice(req, req.params.id);
    if (!notice.reply) throw new HttpError(400, 'No draft exists yet');
    if (!notice.reply.reviewedAt) {
      throw new HttpError(403, 'Export is locked until the draft is reviewed and approved by the professional');
    }

    const buffer = await textToDocx({
      title: `Reply to ${notice.noticeType || 'GST Notice'}${notice.period ? ` — ${notice.period}` : ''}`,
      bodyText: notice.reply.draftText,
      footerNote: 'Draft prepared with THEMIS and approved by the undersigned professional, who remains solely responsible for its contents. Citations machine-verified against curated statutory corpus.',
    });

    await prisma.reply.update({ where: { id: notice.reply.id }, data: { exportedAt: new Date() } });
    await prisma.notice.update({ where: { id: notice.id }, data: { status: 'EXPORTED' } });
    await audit(req, 'EXPORT', 'Reply', notice.reply.id, { noticeId: notice.id });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="reply-${notice.noticeType || 'notice'}-${notice.id.slice(0, 8)}.docx"`);
    res.send(buffer);
  } catch (err) { next(err); }
});

export default router;
