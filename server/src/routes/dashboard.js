import { Router } from 'express';
import { prisma } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { computePenaltyExposure } from '../services/deadlineEngine.js';

const router = Router();
router.use(requireAuth);

/** Real dashboard summary — computed from live data, role-aware. */
router.get('/summary', async (req, res, next) => {
  try {
    if (req.user.role === 'INDIVIDUAL') {
      const docs = await prisma.generatedDoc.findMany({ where: { userId: req.user.id } });
      return res.json({
        role: 'INDIVIDUAL',
        documentsGenerated: docs.length,
        finalized: docs.filter((d) => d.status === 'FINAL').length,
        recent: docs.slice(0, 5).map((d) => ({ id: d.id, title: d.title, docType: d.docType, status: d.status, createdAt: d.createdAt })),
      });
    }

    const firmId = req.user.firmId;
    const now = new Date();

    const [clients, deadlines, notices, contractReviews] = await Promise.all([
      prisma.client.count({ where: { firmId } }),
      prisma.deadline.findMany({ where: { client: { firmId } }, include: { client: { select: { name: true } } } }),
      prisma.notice.findMany({
        where: { client: { firmId } },
        include: { reply: { select: { reviewedAt: true } }, client: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.contractReview.count({ where: { user: { firmId } } }),
    ]);

    const radar = computePenaltyExposure(deadlines, now);

    const upcoming = deadlines
      .filter((d) => d.status !== 'DONE' && new Date(d.dueDate) >= now)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5)
      .map((d) => ({
        id: d.id,
        title: d.title,
        clientName: d.client.name,
        dueDate: d.dueDate,
        daysLeft: Math.ceil((new Date(d.dueDate) - now) / (24 * 3600 * 1000)),
        penaltyPerDay: d.penaltyPerDay,
      }));

    const pendingNotices = notices.filter((n) => !['EXPORTED'].includes(n.status)).length;

    res.json({
      role: req.user.role,
      clients,
      pendingNotices,
      totalNotices: notices.length,
      contractReviews,
      penaltyRadar: radar,
      upcomingDeadlines: upcoming,
      recentNotices: notices.slice(0, 5).map((n) => ({
        id: n.id,
        clientName: n.client.name,
        noticeType: n.noticeType,
        status: n.status,
        demandAmount: n.demandAmount,
        dueDate: n.dueDate,
        createdAt: n.createdAt,
      })),
    });
  } catch (err) { next(err); }
});

export default router;
