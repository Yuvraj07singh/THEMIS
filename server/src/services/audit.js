import { prisma } from '../db.js';

/** Tamper-evident audit trail: every sensitive action is recorded with actor, entity, and IP. */
export async function audit(req, action, entityType = null, entityId = null, metadata = null) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: req.user?.id || null,
        action,
        entityType,
        entityId,
        metadata: metadata ? JSON.stringify(metadata) : null,
        ip: req.ip,
      },
    });
  } catch (err) {
    // Audit failure must never break the main flow, but should be visible in logs
    console.error('Audit log write failed:', err.message);
  }
}
