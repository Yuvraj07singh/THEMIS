import { Router } from 'express';
import fs from 'fs/promises';
import { prisma } from '../db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { uploadContract } from '../middleware/upload.js';
import { HttpError } from '../middleware/errors.js';
import { analyzeContract, extractPdfText } from '../services/ai.js';
import { DEFAULT_PLAYBOOK } from '../data/contractPlaybook.js';
import { audit } from '../services/audit.js';

const router = Router();
router.use(requireAuth, requireRole('LAWYER', 'CA'));

/**
 * Quote verification — anti-hallucination for contract findings.
 * A finding's clauseQuote must actually appear in the contract text (normalized
 * for whitespace). Findings with fabricated quotes are marked unverified.
 */
function normalize(s) {
  return (s || '').toLowerCase().replace(/[\s ]+/g, ' ').replace(/[""]/g, '"').replace(/['']/g, "'").trim();
}

function verifyFindings(findings, contractText) {
  const haystack = normalize(contractText);
  return findings.map((f) => {
    if (f.status === 'SILENT' || !f.clauseQuote) {
      return { ...f, verified: f.status === 'SILENT' };
    }
    const verified = haystack.includes(normalize(f.clauseQuote));
    return { ...f, verified, ...(verified ? {} : { warning: 'Quoted clause could not be located verbatim in the document — verify manually' }) };
  });
}

function computeRiskScore(findings) {
  const weights = { HIGH: 25, MEDIUM: 12, LOW: 5 };
  const playbookById = Object.fromEntries(DEFAULT_PLAYBOOK.map((r) => [r.id, r]));
  let score = 0;
  for (const f of findings) {
    const rule = playbookById[f.ruleId];
    if (!rule) continue;
    if (f.status === 'VIOLATION') score += weights[rule.severity] || 10;
    else if (f.status === 'SILENT' && rule.severity === 'HIGH') score += 8;
  }
  return Math.min(100, score);
}

router.get('/playbook', (_req, res) => {
  res.json({ playbook: DEFAULT_PLAYBOOK });
});

router.get('/', async (req, res, next) => {
  try {
    const reviews = await prisma.contractReview.findMany({
      where: { user: { firmId: req.user.firmId } },
      include: { document: { select: { filename: true } }, user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ reviews });
  } catch (err) { next(err); }
});

/** Upload + analyze a contract against the playbook. */
router.post('/', uploadContract.single('file'), async (req, res, next) => {
  try {
    if (!req.file) throw new HttpError(400, 'Please attach the contract (PDF or text file)');

    const document = await prisma.document.create({
      data: {
        ownerId: req.user.id,
        filename: req.file.originalname,
        path: req.file.path,
        mimeType: req.file.mimetype,
        size: req.file.size,
        kind: 'CONTRACT',
      },
    });

    let review = await prisma.contractReview.create({
      data: { userId: req.user.id, documentId: document.id, status: 'UPLOADED' },
    });
    await audit(req, 'UPLOAD', 'ContractReview', review.id, { filename: req.file.originalname });

    try {
      const contractText = req.file.mimetype === 'application/pdf'
        ? await extractPdfText(req.file.path)
        : await fs.readFile(req.file.path, 'utf-8');

      if (!contractText || contractText.trim().length < 200) {
        throw new HttpError(422, 'Could not read enough text from this document to review it');
      }

      const result = await analyzeContract({ contractText, playbookRules: DEFAULT_PLAYBOOK });
      const findings = verifyFindings(result.findings || [], contractText);
      const riskScore = computeRiskScore(findings);

      review = await prisma.contractReview.update({
        where: { id: review.id },
        data: { status: 'ANALYZED', findingsJson: JSON.stringify(findings), riskScore },
      });
      await audit(req, 'DRAFT', 'ContractReview', review.id, {
        riskScore,
        violations: findings.filter((f) => f.status === 'VIOLATION').length,
        unverifiedQuotes: findings.filter((f) => f.verified === false).length,
      });
    } catch (err) {
      await prisma.contractReview.update({ where: { id: review.id }, data: { status: 'FAILED' } });
      throw err;
    }

    res.status(201).json({ review });
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const review = await prisma.contractReview.findFirst({
      where: { id: req.params.id, user: { firmId: req.user.firmId } },
      include: { document: { select: { filename: true } } },
    });
    if (!review) throw new HttpError(404, 'Review not found');
    res.json({ review });
  } catch (err) { next(err); }
});

/** Review gate — lawyer signs off on the analysis. */
router.post('/:id/approve', async (req, res, next) => {
  try {
    const existing = await prisma.contractReview.findFirst({
      where: { id: req.params.id, user: { firmId: req.user.firmId } },
    });
    if (!existing) throw new HttpError(404, 'Review not found');
    if (existing.status !== 'ANALYZED') throw new HttpError(400, 'Analysis has not completed');

    const review = await prisma.contractReview.update({
      where: { id: existing.id },
      data: { status: 'APPROVED', approvedAt: new Date() },
    });
    await audit(req, 'APPROVE', 'ContractReview', review.id);
    res.json({ review });
  } catch (err) { next(err); }
});

export default router;
