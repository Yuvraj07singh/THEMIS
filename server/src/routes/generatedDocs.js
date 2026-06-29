import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { HttpError } from '../middleware/errors.js';
import { getDocType, listDocTypes } from '../data/docTemplates.js';
import { textToDocx } from '../services/docxExport.js';
import { audit } from '../services/audit.js';

const router = Router();
router.use(requireAuth); // any role may generate documents

const DISCLAIMER = 'This document was generated from a standard template based on your answers. It is a draft for your review, not legal advice. THEMIS is a technology platform and not a law firm. Have the document reviewed by a qualified professional, and check applicable stamp duty and registration requirements in your state before execution.';

router.get('/types', (_req, res) => {
  res.json({ types: listDocTypes() });
});

router.get('/', async (req, res, next) => {
  try {
    const docs = await prisma.generatedDoc.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      select: { id: true, docType: true, title: true, status: true, createdAt: true },
    });
    res.json({ docs });
  } catch (err) { next(err); }
});

/** Generate from template — deterministic substitution, no AI involved. */
router.post('/generate', async (req, res, next) => {
  try {
    const { docType, answers } = z.object({
      docType: z.string(),
      answers: z.record(z.string()),
    }).parse(req.body);

    const template = getDocType(docType);
    if (!template) throw new HttpError(400, 'Unknown document type');

    // Validate every required answer is present and non-trivial
    for (const q of template.questions) {
      const val = (answers[q.key] || '').trim();
      if (q.required && !val) throw new HttpError(400, `Missing answer: ${q.label}`);
      if (q.type === 'select' && val && !q.options.includes(val)) {
        throw new HttpError(400, `Invalid option for: ${q.label}`);
      }
      // Basic injection hygiene for free-text answers placed into the document
      if (val.length > 300) throw new HttpError(400, `Answer too long: ${q.label}`);
    }

    const contentText = template.build(answers);

    const doc = await prisma.generatedDoc.create({
      data: {
        userId: req.user.id,
        docType,
        title: template.title,
        answersJson: JSON.stringify(answers),
        contentText,
        status: 'DRAFT',
      },
    });

    await audit(req, 'GENERATE', 'GeneratedDoc', doc.id, { docType });
    res.status(201).json({ doc });
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const doc = await prisma.generatedDoc.findFirst({ where: { id: req.params.id, userId: req.user.id } });
    if (!doc) throw new HttpError(404, 'Document not found');
    res.json({ doc });
  } catch (err) { next(err); }
});

/** User confirms they have reviewed the draft. */
router.post('/:id/finalize', async (req, res, next) => {
  try {
    const existing = await prisma.generatedDoc.findFirst({ where: { id: req.params.id, userId: req.user.id } });
    if (!existing) throw new HttpError(404, 'Document not found');

    const doc = await prisma.generatedDoc.update({ where: { id: existing.id }, data: { status: 'FINAL' } });
    await audit(req, 'APPROVE', 'GeneratedDoc', doc.id);
    res.json({ doc });
  } catch (err) { next(err); }
});

router.get('/:id/export', async (req, res, next) => {
  try {
    const doc = await prisma.generatedDoc.findFirst({ where: { id: req.params.id, userId: req.user.id } });
    if (!doc) throw new HttpError(404, 'Document not found');

    const buffer = await textToDocx({ title: doc.title, bodyText: doc.contentText, footerNote: DISCLAIMER });
    await audit(req, 'EXPORT', 'GeneratedDoc', doc.id);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${doc.docType.toLowerCase()}-${doc.id.slice(0, 8)}.docx"`);
    res.send(buffer);
  } catch (err) { next(err); }
});

export default router;
