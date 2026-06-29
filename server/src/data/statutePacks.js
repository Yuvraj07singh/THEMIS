/**
 * Curated statute packs — the anti-hallucination layer.
 *
 * The AI is ONLY allowed to cite provisions from these packs. Each entry is a
 * carefully curated summary of the provision (verify against the bare Act before
 * filing — the review gate exists for exactly this reason). The citation verifier
 * checks every citation in a draft against this corpus; anything not found here
 * is flagged and stripped.
 *
 * Pack selection is deterministic: notice type -> pack. The model never free-recalls law.
 */

const PROVISIONS = {
  'CGST-73': {
    id: 'CGST-73',
    act: 'CGST Act, 2017',
    ref: 'Section 73',
    title: 'Determination of tax not paid or short paid — other than fraud',
    text: 'Section 73 of the CGST Act, 2017 applies where tax has not been paid, short paid, erroneously refunded, or input tax credit has been wrongly availed or utilised, for reasons OTHER than fraud, wilful misstatement or suppression of facts. The proper officer shall issue a show cause notice at least 3 months prior to the time limit for issuance of order. The order must be issued within 3 years from the due date of the annual return for the relevant financial year. If the taxpayer pays the tax with interest under Section 50 before the notice, or within 30 days of the notice, no penalty is payable and proceedings are deemed concluded. Penalty otherwise is 10% of tax or Rs. 10,000, whichever is higher.',
  },
  'CGST-74': {
    id: 'CGST-74',
    act: 'CGST Act, 2017',
    ref: 'Section 74',
    title: 'Determination of tax not paid — fraud, wilful misstatement or suppression',
    text: 'Section 74 of the CGST Act, 2017 applies where tax has not been paid, short paid, erroneously refunded, or ITC wrongly availed by reason of fraud, wilful misstatement, or suppression of facts to evade tax. The order must be issued within 5 years from the due date of the annual return. If tax with interest and 15% penalty is paid before the notice, proceedings conclude. If paid within 30 days of notice with 25% penalty, proceedings conclude. After order, penalty equals 100% of the tax. The burden of establishing fraud or suppression lies on the department; mere non-payment is not suppression.',
  },
  'CGST-61': {
    id: 'CGST-61',
    act: 'CGST Act, 2017',
    ref: 'Section 61',
    title: 'Scrutiny of returns',
    text: 'Section 61 of the CGST Act, 2017 empowers the proper officer to scrutinize returns and related particulars to verify their correctness, and to inform the taxpayer of discrepancies noticed (in Form ASMT-10) seeking explanation. If the explanation is found acceptable, the taxpayer shall be informed (Form ASMT-12) and no further action shall be taken. If no satisfactory explanation is furnished within 30 days (or further period permitted), the officer may initiate appropriate action including proceedings under Section 65, 66, 67, or determination of tax under Section 73 or 74.',
  },
  'CGST-46': {
    id: 'CGST-46',
    act: 'CGST Act, 2017',
    ref: 'Section 46',
    title: 'Notice to return defaulters (GSTR-3A)',
    text: 'Section 46 of the CGST Act, 2017 provides that where a registered person fails to furnish a return under Section 39 (GSTR-3B), Section 44 (annual return) or Section 45 (final return), a notice (Form GSTR-3A) shall be issued requiring the return to be furnished within 15 days. Under Section 62, if the return is not filed within 15 days of the GSTR-3A notice, the proper officer may assess the tax liability to the best of his judgment. A best-judgment assessment order is deemed withdrawn if a valid return is filed within 60 days of service of the assessment order (extendable with late fee).',
  },
  'CGST-50': {
    id: 'CGST-50',
    act: 'CGST Act, 2017',
    ref: 'Section 50',
    title: 'Interest on delayed payment of tax',
    text: 'Section 50 of the CGST Act, 2017 provides for interest at a rate not exceeding 18% per annum on delayed payment of tax, calculated from the day succeeding the due date. As amended retrospectively (Finance Act 2021), interest on tax payable on supplies declared in a return furnished after the due date is payable on the portion paid by debiting the electronic CASH ledger only — i.e., no interest on the amount discharged through available input tax credit. Interest on wrongly availed ITC applies only where such ITC is both availed AND utilised (Rule 88B).',
  },
  'CGST-16': {
    id: 'CGST-16',
    act: 'CGST Act, 2017',
    ref: 'Section 16',
    title: 'Eligibility and conditions for input tax credit',
    text: 'Section 16 of the CGST Act, 2017 sets the conditions for availing input tax credit: possession of a valid tax invoice, receipt of the goods or services, the tax charged having been actually paid to the Government by the supplier, and furnishing of the return under Section 39. Section 16(2)(aa) requires the invoice to be furnished by the supplier in GSTR-1 and communicated in GSTR-2B. Section 16(4) bars availment of ITC for an invoice after 30th November following the end of the financial year, or furnishing of the annual return, whichever is earlier.',
  },
  'CGST-122': {
    id: 'CGST-122',
    act: 'CGST Act, 2017',
    ref: 'Section 122',
    title: 'Penalty for certain offences',
    text: 'Section 122 of the CGST Act, 2017 prescribes penalties for specified offences including supplying goods without invoice, issuing invoice without supply, failing to deduct or collect tax, and availing ITC without actual receipt of goods or services. The penalty is Rs. 10,000 or an amount equivalent to the tax evaded / ITC wrongly availed, whichever is higher. Penalty under Section 122 requires that the specific offence be established; it cannot be imposed mechanically alongside every demand.',
  },
  'CGST-47': {
    id: 'CGST-47',
    act: 'CGST Act, 2017',
    ref: 'Section 47',
    title: 'Levy of late fee',
    text: 'Section 47 of the CGST Act, 2017 levies a late fee of Rs. 100 per day (CGST) subject to a maximum of Rs. 5,000 for failure to furnish returns by the due date — an equal amount applies under the SGST Act, totalling Rs. 200 per day. By notifications (including 19/2021-CT and subsequent amnesty notifications), late fee for GSTR-3B has been capped based on turnover: for taxpayers with nil tax liability, Rs. 20 per day (CGST+SGST combined Rs. 20/day capped at Rs. 500); for others with turnover up to Rs. 1.5 crore, capped at Rs. 2,000; turnover Rs. 1.5-5 crore capped at Rs. 5,000.',
  },
  'CGST-RULE-142': {
    id: 'CGST-RULE-142',
    act: 'CGST Rules, 2017',
    ref: 'Rule 142',
    title: 'Notice and order for demand (DRC forms)',
    text: 'Rule 142 of the CGST Rules, 2017 prescribes the demand procedure: a summary of show cause notice in Form DRC-01 must accompany the notice under Section 73/74; intimation of tax ascertained BEFORE issuance of notice is communicated in Form DRC-01A Part A, and the taxpayer may respond in Part B or pay via DRC-03. The taxpayer may file a reply to the show cause notice in Form DRC-06, and may request a personal hearing. An order summary issues in DRC-07. Payment made before or after the notice is intimated through DRC-03.',
  },
  'CGST-75': {
    id: 'CGST-75',
    act: 'CGST Act, 2017',
    ref: 'Section 75',
    title: 'General provisions relating to determination of tax',
    text: 'Section 75 of the CGST Act, 2017 contains mandatory procedural safeguards: an opportunity of personal hearing SHALL be granted where requested in writing or where any adverse decision is contemplated (Section 75(4)). The adjudication order cannot travel beyond the grounds specified in the show cause notice (Section 75(7)) — the amount and grounds confirmed cannot exceed or differ from those in the notice. Where self-assessed tax in GSTR-1 is unpaid, it may be recovered under Section 79 without separate proceedings (Section 75(12)).',
  },
};

/** Map each supported notice type to its relevant statutory pack. */
const PACKS = {
  'DRC-01': ['CGST-73', 'CGST-74', 'CGST-RULE-142', 'CGST-75', 'CGST-50', 'CGST-16', 'CGST-122'],
  'DRC-01A': ['CGST-73', 'CGST-74', 'CGST-RULE-142', 'CGST-50'],
  'ASMT-10': ['CGST-61', 'CGST-73', 'CGST-16', 'CGST-50'],
  'GSTR-3A': ['CGST-46', 'CGST-47', 'CGST-50'],
  OTHER: ['CGST-73', 'CGST-61', 'CGST-50', 'CGST-75', 'CGST-RULE-142'],
};

export function getPackForNoticeType(noticeType) {
  const ids = PACKS[noticeType] || PACKS.OTHER;
  return ids.map((id) => PROVISIONS[id]);
}

export function getProvision(id) {
  return PROVISIONS[id] || null;
}

export const SUPPORTED_NOTICE_TYPES = Object.keys(PACKS).filter((k) => k !== 'OTHER');
