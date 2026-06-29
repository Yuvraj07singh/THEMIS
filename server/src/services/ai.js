import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs/promises';
import { HttpError } from '../middleware/errors.js';
import { getPackForNoticeType, SUPPORTED_NOTICE_TYPES } from '../data/statutePacks.js';

const EXTRACTION_MODEL = 'claude-haiku-4-5-20251001';
const DRAFTING_MODEL = 'claude-sonnet-4-6';

function getClient() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new HttpError(503, 'AI is not configured yet. Add ANTHROPIC_API_KEY to server/.env (get a key at console.anthropic.com).');
  }
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

/** Pull the first JSON object out of a model response, tolerating markdown fences. */
function parseJson(text) {
  const cleaned = text.replace(/```json|```/g, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1) throw new HttpError(502, 'AI returned an unreadable response. Please retry.');
  return JSON.parse(cleaned.slice(start, end + 1));
}

/**
 * Stage 1 — extraction. Reads the notice PDF and returns structured facts only.
 * No legal reasoning happens here; facts are extracted or marked null, never guessed.
 */
export async function extractNotice(pdfPath) {
  const client = getClient();
  const pdfData = await fs.readFile(pdfPath);

  const response = await client.messages.create({
    model: EXTRACTION_MODEL,
    max_tokens: 1500,
    messages: [{
      role: 'user',
      content: [
        {
          type: 'document',
          source: { type: 'base64', media_type: 'application/pdf', data: pdfData.toString('base64') },
        },
        {
          type: 'text',
          text: `You are extracting structured facts from an Indian GST notice. Return ONLY a JSON object with these fields:
{
  "noticeType": one of ${JSON.stringify(SUPPORTED_NOTICE_TYPES)} or "OTHER",
  "section": the statutory section cited in the notice (e.g. "73(1)") or null,
  "period": the tax period the notice relates to (e.g. "Apr 2025 - Sep 2025") or null,
  "demandAmount": total demand in rupees as a number, or null,
  "dueDate": reply due date as "YYYY-MM-DD" or null,
  "issuedBy": the issuing office/officer designation or null,
  "gstin": the GSTIN mentioned or null,
  "allegations": array of short strings, each one specific allegation/discrepancy raised in the notice,
  "documentIsGstNotice": true/false — false if this does not appear to be a GST notice at all
}
CRITICAL RULES: Extract only what is actually present in the document. If a field is not clearly stated, use null. Never infer or invent values. Do not include any text outside the JSON object.`,
        },
      ],
    }],
  });

  const extraction = parseJson(response.content[0].text);
  if (extraction.documentIsGstNotice === false) {
    throw new HttpError(422, 'This document does not appear to be a GST notice. Please upload the notice PDF.');
  }
  return extraction;
}

/**
 * Stage 2 — drafting. The model receives the extraction plus the curated statute
 * pack for this notice type, and may cite ONLY from that pack. Citations come back
 * structured for machine verification. Due dates / amounts are taken from the
 * extraction, never computed by the model.
 */
export async function draftReply({ extraction, client: clientRecord }) {
  const aiClient = getClient();
  const pack = getPackForNoticeType(extraction.noticeType);

  const packText = pack
    .map((p) => `[${p.id}] ${p.act}, ${p.ref} — ${p.title}\n${p.text}`)
    .join('\n\n');

  const response = await aiClient.messages.create({
    model: DRAFTING_MODEL,
    max_tokens: 4000,
    messages: [{
      role: 'user',
      content: `You are a senior tax associate drafting a reply to a GST notice for a Chartered Accountant's review. The CA will review, edit, sign and file this — it is a DRAFT.

NOTICE FACTS (extracted from the actual notice — treat as ground truth):
${JSON.stringify(extraction, null, 2)}

TAXPAYER:
Name: ${clientRecord.name}
GSTIN: ${clientRecord.gstin || 'as per notice'}
Entity type: ${clientRecord.entityType}

CURATED STATUTORY PROVISIONS — you may cite ONLY from this list, using the bracketed IDs:
${packText}

Draft a professional reply that:
1. Opens with reference to the notice (type, period, and date if available).
2. Responds to EACH allegation listed in the extraction, point by point.
3. Raises applicable procedural and substantive grounds from the provisions above (e.g. limitation, absence of fraud elements for s.73 vs s.74, ITC conditions, interest computation on cash component only, personal hearing under s.75(4)) — but ONLY where genuinely relevant to the allegations.
4. Where facts are needed that you do not have (reconciliation figures, invoice details), insert a clearly marked placeholder like [CA TO INSERT: reconciliation of GSTR-1 vs GSTR-3B for the period].
5. Closes with a request for personal hearing and for dropping of proceedings.

Return ONLY a JSON object:
{
  "replyText": "the full draft reply as plain text with paragraph breaks",
  "citations": [{ "id": "provision id from the pack, e.g. CGST-73", "sectionRef": "Section 73", "point": "one line on what this citation supports" }]
}

CRITICAL RULES:
- Cite only provision IDs from the pack above. If a legal point has no supporting provision in the pack, state it generally WITHOUT a citation rather than inventing one.
- Never invent facts, figures, dates, or case law. Use [CA TO INSERT: ...] placeholders for missing facts.
- Do not compute deadlines or interest amounts — leave those to the firm's calculation.
- No text outside the JSON object.`,
    }],
  });

  return parseJson(response.content[0].text);
}

/** Extract full plain text from a contract PDF (needed so clause quotes can be machine-verified). */
export async function extractPdfText(pdfPath) {
  const client = getClient();
  const pdfData = await fs.readFile(pdfPath);

  const response = await client.messages.create({
    model: EXTRACTION_MODEL,
    max_tokens: 8000,
    messages: [{
      role: 'user',
      content: [
        {
          type: 'document',
          source: { type: 'base64', media_type: 'application/pdf', data: pdfData.toString('base64') },
        },
        {
          type: 'text',
          text: 'Transcribe the complete text of this document verbatim. Output only the document text, preserving paragraph structure. Do not summarize, comment, or omit anything.',
        },
      ],
    }],
  });

  return response.content[0].text;
}

/**
 * Contract analysis for law firms. The model checks contract text against the
 * firm's playbook rules and must QUOTE the exact clause text for every finding —
 * quotes are verified against the contract server-side; unverifiable findings are flagged.
 */
export async function analyzeContract({ contractText, playbookRules }) {
  const aiClient = getClient();

  const rulesText = playbookRules
    .map((r) => `[${r.id}] (${r.severity}) ${r.rule}`)
    .join('\n');

  const response = await aiClient.messages.create({
    model: DRAFTING_MODEL,
    max_tokens: 4000,
    messages: [{
      role: 'user',
      content: `You are reviewing a contract against a law firm's negotiation playbook. The reviewing lawyer makes all final decisions — you are producing a first-pass issues list.

PLAYBOOK RULES:
${rulesText}

CONTRACT TEXT:
${contractText.slice(0, 60000)}

For each playbook rule, determine whether the contract complies, violates it, or is silent. Return ONLY a JSON object:
{
  "findings": [{
    "ruleId": "rule id from the playbook",
    "status": "COMPLIANT" | "VIOLATION" | "SILENT",
    "clauseQuote": "the EXACT text from the contract that triggers this finding (verbatim, max 300 chars) — null if status is SILENT",
    "explanation": "one or two sentences",
    "recommendation": "suggested redline action, one sentence"
  }]
}

CRITICAL RULES:
- clauseQuote must be copied VERBATIM from the contract text — it will be machine-checked against the document, and findings with fabricated quotes are discarded.
- If the contract does not address a rule, use status SILENT with clauseQuote null.
- No text outside the JSON object.`,
    }],
  });

  return parseJson(response.content[0].text);
}
