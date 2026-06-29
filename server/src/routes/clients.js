import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { HttpError } from '../middleware/errors.js';
import { generateDeadlines } from '../services/deadlineEngine.js';
import { audit } from '../services/audit.js';

const router = Router();
router.use(requireAuth, requireRole('CA', 'LAWYER'));

const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

const clientSchema = z.object({
  name: z.string().trim().min(2, 'Client name is required').max(150),
  gstin: z.string().trim().toUpperCase().regex(GSTIN_REGEX, 'Invalid GSTIN format (15 characters, e.g. 07ABCDE1234F1Z5)').optional().or(z.literal('')),
  pan: z.string().trim().toUpperCase().regex(PAN_REGEX, 'Invalid PAN format (e.g. ABCDE1234F)').optional().or(z.literal('')),
  entityType: z.enum(['PROPRIETORSHIP', 'PARTNERSHIP', 'LLP', 'PVT_LTD', 'PUBLIC_LTD']),
  state: z.string().trim().max(60).optional(),
  qrmpOpted: z.boolean().optional().default(false),
  hasTds: z.boolean().optional().default(false),
  hasPfEsi: z.boolean().optional().default(false),
});

router.get('/', async (req, res, next) => {
  try {
    const clients = await prisma.client.findMany({
      where: { firmId: req.user.firmId },
      include: { _count: { select: { notices: true, deadlines: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ clients });
  } catch (err) { next(err); }
});

/** Create client + auto-generate their statutory calendar (deterministic rules engine). */
router.post('/', async (req, res, next) => {
  try {
    const data = clientSchema.parse(req.body);

    const client = await prisma.client.create({
      data: {
        firmId: req.user.firmId,
        name: data.name,
        gstin: data.gstin || null,
        pan: data.pan || null,
        entityType: data.entityType,
        state: data.state || null,
        qrmpOpted: data.qrmpOpted,
        hasTds: data.hasTds,
        hasPfEsi: data.hasPfEsi,
      },
    });

    const deadlines = generateDeadlines(client);
    if (deadlines.length) {
      await prisma.deadline.createMany({
        data: deadlines.map((dl) => ({ ...dl, clientId: client.id })),
      });
    }

    await audit(req, 'CREATE', 'Client', client.id, { deadlinesGenerated: deadlines.length });
    res.status(201).json({ client, deadlinesGenerated: deadlines.length });
  } catch (err) { next(err); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const data = clientSchema.parse(req.body);
    const existing = await prisma.client.findFirst({ where: { id: req.params.id, firmId: req.user.firmId } });
    if (!existing) throw new HttpError(404, 'Client not found');

    const client = await prisma.client.update({
      where: { id: existing.id },
      data: {
        name: data.name,
        gstin: data.gstin || null,
        pan: data.pan || null,
        entityType: data.entityType,
        state: data.state || null,
        qrmpOpted: data.qrmpOpted,
        hasTds: data.hasTds,
        hasPfEsi: data.hasPfEsi,
      },
    });

    // Profile changes can change the statutory calendar — regenerate upcoming, keep completed
    await prisma.deadline.deleteMany({ where: { clientId: client.id, status: 'UPCOMING' } });
    const deadlines = generateDeadlines(client);
    for (const dl of deadlines) {
      await prisma.deadline.upsert({
        where: { clientId_kind_dueDate: { clientId: client.id, kind: dl.kind, dueDate: dl.dueDate } },
        create: { ...dl, clientId: client.id },
        update: {},
      });
    }

    await audit(req, 'UPDATE', 'Client', client.id);
    res.json({ client });
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const existing = await prisma.client.findFirst({ where: { id: req.params.id, firmId: req.user.firmId } });
    if (!existing) throw new HttpError(404, 'Client not found');

    await prisma.deadline.deleteMany({ where: { clientId: existing.id } });
    const notices = await prisma.notice.findMany({ where: { clientId: existing.id }, select: { id: true } });
    await prisma.reply.deleteMany({ where: { noticeId: { in: notices.map((n) => n.id) } } });
    await prisma.notice.deleteMany({ where: { clientId: existing.id } });
    await prisma.document.deleteMany({ where: { clientId: existing.id } });
    await prisma.client.delete({ where: { id: existing.id } });

    await audit(req, 'DELETE', 'Client', existing.id);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

export default router;
