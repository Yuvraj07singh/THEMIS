/**
 * Deterministic document templates for individual users.
 *
 * These are parameterized templates, NOT AI-generated text — every clause is
 * fixed; only the user's answers are substituted. This makes generation 100%
 * reproducible and hallucination-free by construction. Documents are drafts
 * for review; signing/stamping obligations remain with the user (stated in
 * the footer of every document).
 */

const fmtDate = (iso) => {
  const dt = iso ? new Date(iso) : new Date();
  return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
};

export const DOC_TYPES = {
  NDA: {
    id: 'NDA',
    title: 'Non-Disclosure Agreement',
    description: 'Mutual NDA for protecting confidential information shared between two parties.',
    questions: [
      { key: 'party1Name', label: 'Your / your company\'s full legal name', type: 'text', required: true },
      { key: 'party1Address', label: 'Your address', type: 'text', required: true },
      { key: 'party2Name', label: 'Other party\'s full legal name', type: 'text', required: true },
      { key: 'party2Address', label: 'Other party\'s address', type: 'text', required: true },
      { key: 'purpose', label: 'Purpose of sharing information (e.g. "evaluating a potential business partnership")', type: 'text', required: true },
      { key: 'termYears', label: 'Confidentiality period (years)', type: 'select', options: ['2', '3', '5'], required: true },
      { key: 'city', label: 'City whose courts have jurisdiction', type: 'text', required: true },
      { key: 'effectiveDate', label: 'Effective date', type: 'date', required: true },
    ],
    build: (a) => `MUTUAL NON-DISCLOSURE AGREEMENT

This Mutual Non-Disclosure Agreement ("Agreement") is entered into on ${fmtDate(a.effectiveDate)} ("Effective Date") between:

1. ${a.party1Name}, having its address at ${a.party1Address} ("First Party"); and
2. ${a.party2Name}, having its address at ${a.party2Address} ("Second Party"),
(each a "Party" and together the "Parties").

1. PURPOSE
The Parties wish to exchange certain confidential information for the purpose of ${a.purpose} (the "Purpose").

2. CONFIDENTIAL INFORMATION
"Confidential Information" means all non-public information disclosed by either Party to the other, whether oral, written, electronic or in any other form, including business plans, financial information, technical data, customer lists, software, designs and know-how, that is designated as confidential or that a reasonable person would understand to be confidential.

3. EXCLUSIONS
Confidential Information does not include information that: (a) is or becomes publicly available through no breach of this Agreement; (b) was lawfully known to the receiving Party before disclosure; (c) is lawfully received from a third party without restriction; or (d) is independently developed without use of the disclosing Party's Confidential Information.

4. OBLIGATIONS
Each Party shall: (a) use the other Party's Confidential Information solely for the Purpose; (b) protect it with at least the same degree of care it uses for its own confidential information, and no less than reasonable care; (c) not disclose it to any third party except to employees and advisors who need to know it for the Purpose and are bound by confidentiality obligations no less protective than this Agreement; and (d) notify the disclosing Party promptly upon becoming aware of any unauthorised use or disclosure.

5. COMPELLED DISCLOSURE
If the receiving Party is required by law, regulation or court order to disclose Confidential Information, it shall, to the extent legally permitted, give the disclosing Party prompt written notice and reasonable assistance to seek protective treatment.

6. TERM
This Agreement is effective from the Effective Date. The obligations of confidentiality shall survive for a period of ${a.termYears} years from the date of disclosure.

7. NO LICENCE; NO OBLIGATION
Nothing in this Agreement grants any licence or other rights in the Confidential Information. Neither Party is obliged to proceed with any transaction.

8. RETURN OR DESTRUCTION
On written request, the receiving Party shall return or destroy all Confidential Information and certify such destruction in writing, save for copies required to be retained by law.

9. REMEDIES
The Parties acknowledge that breach of this Agreement may cause irreparable harm for which damages are an inadequate remedy, and that the disclosing Party shall be entitled to seek injunctive relief in addition to all other remedies.

10. GOVERNING LAW AND JURISDICTION
This Agreement is governed by the laws of India. The courts at ${a.city} shall have exclusive jurisdiction, subject to clause 11.

11. DISPUTE RESOLUTION
Any dispute arising out of or in connection with this Agreement shall be resolved by arbitration by a sole arbitrator under the Arbitration and Conciliation Act, 1996, seated at ${a.city}, conducted in English.

12. GENERAL
This Agreement constitutes the entire agreement between the Parties on its subject matter, may be amended only in writing signed by both Parties, and may be executed in counterparts (including electronically under the Information Technology Act, 2000).

IN WITNESS WHEREOF, the Parties have executed this Agreement on the Effective Date.

${a.party1Name}                                ${a.party2Name}
Signature: ____________________                Signature: ____________________
Name:                                          Name:
Designation:                                   Designation:
Date:                                          Date:`,
  },

  FOUNDER_AGREEMENT: {
    id: 'FOUNDER_AGREEMENT',
    title: 'Co-Founders\' Agreement',
    description: 'Equity, roles, vesting, deadlock and exit terms between startup co-founders.',
    questions: [
      { key: 'companyName', label: 'Company / proposed company name', type: 'text', required: true },
      { key: 'founder1Name', label: 'Founder 1 full name', type: 'text', required: true },
      { key: 'founder1Equity', label: 'Founder 1 equity %', type: 'text', required: true },
      { key: 'founder2Name', label: 'Founder 2 full name', type: 'text', required: true },
      { key: 'founder2Equity', label: 'Founder 2 equity %', type: 'text', required: true },
      { key: 'ceoName', label: 'Who is the CEO?', type: 'text', required: true },
      { key: 'vesting', label: 'Vesting schedule', type: 'select', options: ['4-year vesting with 1-year cliff', '3-year vesting with 6-month cliff', 'Milestone-based vesting'], required: true },
      { key: 'deadlock', label: 'Deadlock resolution', type: 'select', options: ['CEO has casting vote', 'Mediation, then arbitration', 'Shotgun clause (buy or sell)'], required: true },
      { key: 'city', label: 'City whose courts have jurisdiction', type: 'text', required: true },
      { key: 'effectiveDate', label: 'Effective date', type: 'date', required: true },
    ],
    build: (a) => `CO-FOUNDERS' AGREEMENT

This Co-Founders' Agreement ("Agreement") is entered into on ${fmtDate(a.effectiveDate)} between:

1. ${a.founder1Name} ("Founder 1"); and
2. ${a.founder2Name} ("Founder 2"),
(each a "Founder" and together the "Founders"), in relation to ${a.companyName} (the "Company").

1. BUSINESS
The Founders agree to carry on the business of the Company jointly and to act in good faith towards each other in all matters relating to the Company.

2. EQUITY
The equity of the Company shall be held as follows:
- ${a.founder1Name}: ${a.founder1Equity}%
- ${a.founder2Name}: ${a.founder2Equity}%
Any future dilution shall apply to the Founders pro rata unless agreed otherwise in writing.

3. VESTING
All Founder equity shall be subject to ${a.vesting}. Unvested shares of a Founder who ceases to be engaged with the Company shall be bought back or cancelled at the lower of face value and fair market value, as permitted by law. Vesting accelerates in full on a sale of the Company (single-trigger acceleration on change of control).

4. ROLES AND RESPONSIBILITIES
${a.ceoName} shall serve as Chief Executive Officer, responsible for day-to-day management. Material decisions — including issue of new shares, borrowing above limits agreed in writing, sale of material assets, and appointment of key managerial personnel — shall require the written consent of both Founders.

5. INTELLECTUAL PROPERTY
Each Founder hereby assigns to the Company all rights, title and interest in all intellectual property created by them that relates to the business of the Company, whether created before or after the date of this Agreement, and shall execute all documents necessary to perfect such assignment.

6. CONFIDENTIALITY AND NON-COMPETE
Each Founder shall keep the Company's information confidential, and shall not, while engaged with the Company and for 12 months thereafter, directly engage in a business that competes with the Company in India, to the extent enforceable under Section 27 of the Indian Contract Act, 1872.

7. DEADLOCK
If the Founders are unable to agree on a material decision for 30 days, the matter shall be resolved as follows: ${a.deadlock}.

8. EXIT AND TRANSFER RESTRICTIONS
No Founder shall transfer shares without first offering them to the other Founder (right of first refusal) at the same price and terms. A Founder leaving the Company voluntarily within 24 months shall offer all vested shares to the other Founder at fair market value determined by an independent valuer. Tag-along rights apply to any sale by a Founder of more than 25% of the Company's shares.

9. TERMINATION OF ENGAGEMENT
A Founder may be removed from an executive role for cause (fraud, gross misconduct, persistent neglect of duties) by written notice. Removal does not affect vested equity, subject to clause 3 and clause 8.

10. GOVERNING LAW AND DISPUTES
This Agreement is governed by the laws of India. Disputes shall be referred to arbitration by a sole arbitrator under the Arbitration and Conciliation Act, 1996, seated at ${a.city}, in English. Courts at ${a.city} have exclusive supervisory jurisdiction.

11. ENTIRE AGREEMENT
This Agreement is the entire agreement between the Founders on its subject matter and supersedes all prior understandings. It shall be superseded, to the extent applicable, by the Articles of Association and any Shareholders' Agreement adopted on incorporation or investment.

IN WITNESS WHEREOF the Founders have executed this Agreement on the date first written above.

${a.founder1Name}                              ${a.founder2Name}
Signature: ____________________                Signature: ____________________
Date:                                          Date:`,
  },

  EMPLOYMENT: {
    id: 'EMPLOYMENT',
    title: 'Employment Agreement',
    description: 'Standard employment contract with probation, IP assignment, and notice terms.',
    questions: [
      { key: 'companyName', label: 'Employer / company legal name', type: 'text', required: true },
      { key: 'companyAddress', label: 'Company address', type: 'text', required: true },
      { key: 'employeeName', label: 'Employee full name', type: 'text', required: true },
      { key: 'designation', label: 'Designation / job title', type: 'text', required: true },
      { key: 'ctc', label: 'Annual CTC (in ₹, e.g. 12,00,000)', type: 'text', required: true },
      { key: 'probationMonths', label: 'Probation period (months)', type: 'select', options: ['3', '6'], required: true },
      { key: 'noticeDays', label: 'Notice period (days)', type: 'select', options: ['30', '60', '90'], required: true },
      { key: 'city', label: 'Place of work (city)', type: 'text', required: true },
      { key: 'startDate', label: 'Date of joining', type: 'date', required: true },
    ],
    build: (a) => `EMPLOYMENT AGREEMENT

This Employment Agreement ("Agreement") is made on ${fmtDate(a.startDate)} between:

${a.companyName}, having its office at ${a.companyAddress} (the "Company"); and
${a.employeeName} (the "Employee").

1. APPOINTMENT
The Company appoints the Employee as ${a.designation}, with effect from ${fmtDate(a.startDate)}. The Employee's primary place of work shall be ${a.city}, subject to travel and relocation on reasonable notice.

2. PROBATION
The Employee shall be on probation for ${a.probationMonths} months, during which either party may terminate this Agreement with 15 days' written notice. Confirmation shall be communicated in writing; absent written confirmation, probation is deemed extended until confirmed.

3. COMPENSATION
The Employee's total annual cost-to-company shall be ₹${a.ctc}, structured as per the Company's compensation policy and subject to statutory deductions (income tax, provident fund, professional tax and other applicable deductions).

4. DUTIES
The Employee shall devote their full working time and attention to the Company, perform duties assigned with diligence, and comply with Company policies as amended from time to time. The Employee shall not take up any other employment, consultancy or business engagement without the Company's prior written consent.

5. INTELLECTUAL PROPERTY
All intellectual property created by the Employee in the course of employment, or using the Company's resources or confidential information, shall vest in and is hereby assigned to the Company. The Employee waives, to the extent permitted by law, all moral rights in such works and shall execute all documents necessary to perfect the Company's rights.

6. CONFIDENTIALITY
The Employee shall keep confidential all non-public information of the Company and its clients, during employment and at all times after its termination, and shall use such information solely for performing their duties.

7. LEAVE AND BENEFITS
The Employee is entitled to leave and benefits as per the Company's policies and applicable law, including the Shops and Establishments legislation applicable at ${a.city}.

8. TERMINATION
After confirmation, either party may terminate this Agreement by giving ${a.noticeDays} days' written notice or, at the Company's discretion, salary in lieu of notice. The Company may terminate without notice for cause, including fraud, misconduct, breach of confidentiality, or conviction of a criminal offence. On termination, the Employee shall return all Company property and data.

9. NON-SOLICITATION
For 12 months after termination, the Employee shall not solicit the Company's employees or clients with whom they had material contact, to the extent enforceable under Indian law.

10. GOVERNING LAW
This Agreement is governed by the laws of India, and the courts at ${a.city} shall have exclusive jurisdiction.

ACCEPTED AND AGREED:

For ${a.companyName}                           ${a.employeeName}
Signature: ____________________                Signature: ____________________
Name:                                          Date:
Designation:`,
  },
};

export function getDocType(id) {
  return DOC_TYPES[id] || null;
}

export function listDocTypes() {
  return Object.values(DOC_TYPES).map(({ id, title, description, questions }) => ({ id, title, description, questions }));
}
