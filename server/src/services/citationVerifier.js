import { getProvision } from '../data/statutePacks.js';

/**
 * Citation verifier — the second half of the anti-hallucination layer.
 *
 * The drafting model must return citations as {id, sectionRef, point} where `id`
 * is a provision id from the statute pack it was given. This verifier:
 *  1. confirms the cited provision id exists in our curated corpus,
 *  2. confirms the section reference in the draft matches the provision,
 *  3. flags any citation that fails either check.
 *
 * A draft is only marked clean when every citation verifies. Failed citations are
 * surfaced to the reviewing professional, never silently kept.
 */

function normalize(s) {
  return (s || '').toLowerCase().replace(/\s+/g, ' ').trim();
}

export function verifyCitations(citations) {
  const results = [];
  let verified = 0;

  for (const c of citations) {
    const provision = getProvision(c.id);
    if (!provision) {
      results.push({ ...c, verified: false, reason: 'Cited provision not found in curated corpus' });
      continue;
    }
    const refMatches = normalize(c.sectionRef).includes(normalize(provision.ref)) ||
      normalize(provision.ref).includes(normalize(c.sectionRef));
    if (!refMatches) {
      results.push({ ...c, verified: false, reason: `Reference mismatch: draft says "${c.sectionRef}", corpus has "${provision.ref}"` });
      continue;
    }
    verified += 1;
    results.push({
      ...c,
      verified: true,
      act: provision.act,
      ref: provision.ref,
      title: provision.title,
      sourceText: provision.text,
    });
  }

  return {
    citations: results,
    summary: {
      total: citations.length,
      verified,
      failed: citations.length - verified,
      clean: verified === citations.length && citations.length > 0,
    },
  };
}
