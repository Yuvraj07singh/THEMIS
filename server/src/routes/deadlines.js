import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { HttpError } from '../middleware/errors.js';
import { audit } from '../services/audit.js';

const router = Router();
router.use(requireAuth, requireRole('CA', 'LAWYER'));

/** All deadlines for the firm, optionally filtered by month or client. */
router.get('/', async (req, res, next) => {
  try {
    const { clientId, from, to } = req.query;
    const where = { client: { firmId: req.user.firmId } };
    if (clientId) where.clientId = String(clientId);
    if (from || to) {
      where.dueDate = {};
      if (from) where.dueDate.gte = new Date(String(from));
      if (to) where.dueDate.lte = new Date(String(to));
    }

    const deadlines = await prisma.deadline.findMany({
      where,
      include: { client: { select: { id: true, name: true } } },
      orderBy: { dueDate: 'asc' },
    });

    // Auto-mark overdue
    const now = new Date();
    for (const dl of deadlines) {
      if (dl.status === 'UPCOMING' && dl.dueDate < now) dl.status = 'OVERDUE';
    }

    res.json({ deadlines });
  } catch (err) { next(err); }
});

/** Mark a deadline filed/done (or back to upcoming). */
router.put('/:id/status', async (req, res, next) => {
  try {
    const { status } = z.object({ status: z.enum(['DONE', 'UPCOMING']) }).parse(req.body);
    const existing = await prisma.deadline.findFirst({
      where: { id: req.params.id, client: { firmId: req.user.firmId } },
    });
    if (!existing) throw new HttpError(404, 'Deadline not found');

    const deadline = await prisma.deadline.update({ where: { id: existing.id }, data: { status } });
    await audit(req, 'UPDATE', 'Deadline', deadline.id, { status });
    res.json({ deadline });
  } catch (err) { next(err); }
});

export default router;
