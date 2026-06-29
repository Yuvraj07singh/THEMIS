/**
 * Default contract review playbook — the firm's negotiation positions.
 * Each rule is checked against the contract by the AI; every finding must quote
 * the exact clause text, which is machine-verified against the document.
 * v2: firms define their own rules; this default pack covers an India-market
 * commercial contract review.
 */

export const DEFAULT_PLAYBOOK = [
  { id: 'PB-01', severity: 'HIGH', rule: 'Governing law and jurisdiction must be India (courts of a named Indian city). Foreign governing law is a violation.' },
  { id: 'PB-02', severity: 'HIGH', rule: 'Liability must be capped (typically at fees paid in the preceding 12 months). Uncapped or unlimited liability is a violation.' },
  { id: 'PB-03', severity: 'HIGH', rule: 'No unilateral indemnity. Indemnity obligations must be mutual or absent. One-sided indemnity against our client is a violation.' },
  { id: 'PB-04', severity: 'MEDIUM', rule: 'Termination for convenience must require at least 30 days written notice.' },
  { id: 'PB-05', severity: 'MEDIUM', rule: 'Payment terms must not exceed 45 days from invoice date.' },
  { id: 'PB-06', severity: 'MEDIUM', rule: 'Confidentiality obligations must survive termination for a defined period (2-5 years standard).' },
  { id: 'PB-07', severity: 'HIGH', rule: 'Dispute resolution by arbitration must be seated in India under the Arbitration and Conciliation Act, 1996.' },
  { id: 'PB-08', severity: 'MEDIUM', rule: 'Intellectual property created under the agreement must be assigned to, or licensed to, the paying party — IP ownership must be expressly addressed.' },
  { id: 'PB-09', severity: 'LOW', rule: 'Force majeure clause should be present and should not excuse payment obligations.' },
  { id: 'PB-10', severity: 'MEDIUM', rule: 'Automatic renewal clauses must require notice before renewal; evergreen auto-renewal without an opt-out window is a violation.' },
];
