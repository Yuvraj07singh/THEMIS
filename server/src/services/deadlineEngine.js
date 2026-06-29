/**
 * Deterministic compliance deadline engine.
 *
 * Due dates are LAW, not language — so they are computed by rules, never by an
 * LLM. Given a client's profile (entity type, GST registration, QRMP option,
 * TDS/PF applicability), this generates their statutory calendar for the next
 * 12 months. Each rule carries its penalty exposure so the dashboard can compute
 * real penalty risk.
 *
 * Rule set covers the recurring federal obligations. State-specific levies and
 * special categories are deliberately out of scope for v1 (the reviewing
 * professional remains responsible for completeness).
 */

const QRMP_22_STATES = new Set([
  'Chhattisgarh', 'Madhya Pradesh', 'Gujarat', 'Maharashtra', 'Karnataka', 'Goa',
  'Kerala', 'Tamil Nadu', 'Telangana', 'Andhra Pradesh', 'Daman and Diu',
  'Dadra and Nagar Haveli', 'Puducherry', 'Andaman and Nicobar Islands', 'Lakshadweep',
]);

function d(year, monthIndex, day) {
  // Noon UTC avoids timezone date-shift issues
  return new Date(Date.UTC(year, monthIndex, day, 12, 0, 0));
}

function monthName(year, monthIndex) {
  return new Date(Date.UTC(year, monthIndex, 15)).toLocaleDateString('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' });
}

/**
 * Generate all statutory deadlines for a client over the next `months` months.
 * Returns plain objects ready for DB insertion.
 */
export function generateDeadlines(client, { from = new Date(), months = 12 } = {}) {
  const deadlines = [];
  const startYear = from.getFullYear();
  const startMonth = from.getMonth();
  const isCompany = client.entityType === 'PVT_LTD' || client.entityType === 'PUBLIC_LTD';
  const hasGst = Boolean(client.gstin);

  for (let i = 0; i < months; i++) {
    const y = startYear + Math.floor((startMonth + i) / 12);
    const m = (startMonth + i) % 12;
    const periodLabel = monthName(y, m === 0 ? 11 : m - 1); // returns filed for the PREVIOUS month
    const fyEndYear = m >= 3 ? y + 1 : y; // Indian FY ends 31 March

    if (hasGst) {
      if (client.qrmpOpted) {
        // QRMP: quarterly GSTR-1 (13th of month after quarter), GSTR-3B (22nd/24th by state)
        if (m === 0 || m === 3 || m === 6 || m === 9) { // Jan, Apr, Jul, Oct — month after quarter end
          const day3b = QRMP_22_STATES.has(client.state) ? 22 : 24;
          deadlines.push({
            kind: 'GSTR1', title: `GSTR-1 (Quarterly) — quarter ending ${monthName(y, m === 0 ? 11 : m - 1)}`,
            dueDate: d(y, m, 13), penaltyPerDay: 50,
            description: 'Quarterly statement of outward supplies under QRMP scheme. Late fee Rs. 50/day (Rs. 20/day for nil returns), capped by turnover.',
          });
          deadlines.push({
            kind: 'GSTR3B', title: `GSTR-3B (Quarterly) — quarter ending ${monthName(y, m === 0 ? 11 : m - 1)}`,
            dueDate: d(y, m, day3b), penaltyPerDay: 50,
            description: `Quarterly summary return under QRMP. Due ${day3b}th for ${client.state || 'your state'}. Late fee Rs. 50/day plus 18% p.a. interest on cash liability under Section 50.`,
          });
        } else {
          // PMT-06 monthly tax payment in months 1 and 2 of the quarter
          deadlines.push({
            kind: 'GSTR3B', title: `PMT-06 tax payment — ${periodLabel}`,
            dueDate: d(y, m, 25), penaltyPerDay: 0,
            description: 'Monthly tax payment under QRMP (months 1-2 of quarter). Interest under Section 50 applies on late payment.',
          });
        }
      } else {
        // Monthly filers
        deadlines.push({
          kind: 'GSTR1', title: `GSTR-1 — ${periodLabel}`,
          dueDate: d(y, m, 11), penaltyPerDay: 50,
          description: 'Monthly statement of outward supplies. Late fee Rs. 50/day (Rs. 20/day nil), capped by turnover under Section 47.',
        });
        deadlines.push({
          kind: 'GSTR3B', title: `GSTR-3B — ${periodLabel}`,
          dueDate: d(y, m, 20), penaltyPerDay: 50,
          description: 'Monthly summary return and tax payment. Late fee Rs. 50/day plus 18% p.a. interest on cash liability under Section 50.',
        });
      }

      // Annual return — GSTR-9 due 31 December following FY end
      if (m === 11) {
        deadlines.push({
          kind: 'GSTR9', title: `GSTR-9 Annual Return — FY ${y - 1}-${String(y).slice(2)}`,
          dueDate: d(y, 11, 31), penaltyPerDay: 200,
          description: 'Annual return for the financial year. Late fee Rs. 200/day (CGST+SGST) capped at 0.5% of turnover. Mandatory above Rs. 2 crore turnover.',
        });
      }
    }

    if (client.hasTds) {
      // TDS deposit — 7th of every month (30 April for March)
      deadlines.push({
        kind: 'TDS_DEPOSIT', title: `TDS deposit — ${periodLabel}`,
        dueDate: m === 3 ? d(y, 3, 30) : d(y, m, 7), penaltyPerDay: 0,
        description: 'Deposit of tax deducted at source. Interest 1.5% per month under Section 201(1A) of the Income-tax Act for late deposit.',
      });
      // Quarterly TDS returns: Q1->31 Jul, Q2->31 Oct, Q3->31 Jan, Q4->31 May
      const tdsReturns = { 6: 'Q1 (Apr-Jun)', 9: 'Q2 (Jul-Sep)', 0: 'Q3 (Oct-Dec)', 4: 'Q4 (Jan-Mar)' };
      if (m in tdsReturns) {
        const day = m === 4 ? 31 : 31;
        deadlines.push({
          kind: 'TDS_RETURN', title: `TDS Return 24Q/26Q — ${tdsReturns[m]}`,
          dueDate: d(y, m, day), penaltyPerDay: 200,
          description: 'Quarterly TDS statement. Late filing fee Rs. 200/day under Section 234E of the Income-tax Act, capped at the TDS amount.',
        });
      }
    }

    if (client.hasPfEsi) {
      deadlines.push({
        kind: 'PF_ESI', title: `PF & ESI payment — ${periodLabel}`,
        dueDate: d(y, m, 15), penaltyPerDay: 0,
        description: 'EPF contribution and ESI payment for the preceding month. Interest and damages apply on delay under EPF Act Section 7Q/14B.',
      });
    }

    // Advance tax instalments: 15 Jun (15%), 15 Sep (45%), 15 Dec (75%), 15 Mar (100%)
    const advTax = { 5: '15% (1st instalment)', 8: '45% cumulative (2nd)', 11: '75% cumulative (3rd)', 2: '100% (final)' };
    if (m in advTax) {
      deadlines.push({
        kind: 'ADVANCE_TAX', title: `Advance tax — ${advTax[m]}`,
        dueDate: d(y, m, 15), penaltyPerDay: 0,
        description: 'Advance tax instalment. Interest under Sections 234B/234C of the Income-tax Act for shortfall or deferment.',
      });
    }

    if (isCompany) {
      // DIR-3 KYC — 30 September
      if (m === 8) {
        deadlines.push({
          kind: 'DIR3_KYC', title: 'DIR-3 KYC (all directors)',
          dueDate: d(y, 8, 30), penaltyPerDay: 0,
          description: 'Annual KYC for every person holding a DIN. Late fee Rs. 5,000 per director and DIN deactivation until filed.',
        });
      }
      // AOC-4 — within 30 days of AGM (AGM latest 30 Sep) -> 29/30 Oct
      if (m === 9) {
        deadlines.push({
          kind: 'MCA_AOC4', title: `AOC-4 Financial Statements — FY ${fyEndYear - 1}-${String(fyEndYear).slice(2)}`,
          dueDate: d(y, 9, 29), penaltyPerDay: 100,
          description: 'Filing of financial statements within 30 days of AGM. Additional fee Rs. 100 per day of default under the Companies Act, 2013.',
        });
      }
      // MGT-7 — within 60 days of AGM -> 28/29 Nov
      if (m === 10) {
        deadlines.push({
          kind: 'MCA_MGT7', title: `MGT-7 Annual Return — FY ${fyEndYear - 1}-${String(fyEndYear).slice(2)}`,
          dueDate: d(y, 10, 28), penaltyPerDay: 100,
          description: 'Annual return within 60 days of AGM. Additional fee Rs. 100 per day of default under the Companies Act, 2013.',
        });
      }
    }
  }

  // Only future deadlines, sorted
  const cutoff = new Date(from.getTime() - 24 * 3600 * 1000);
  return deadlines
    .filter((dl) => dl.dueDate > cutoff)
    .sort((a, b) => a.dueDate - b.dueDate);
}

/** Penalty exposure for the dashboard radar: what starts accruing if nothing is filed. */
export function computePenaltyExposure(deadlines, now = new Date()) {
  const horizon = new Date(now.getTime() + 7 * 24 * 3600 * 1000);
  let weeklyExposure = 0;
  let urgentCount = 0;
  let overdueCount = 0;

  for (const dl of deadlines) {
    if (dl.status === 'DONE') continue;
    const due = new Date(dl.dueDate);
    if (due < now) {
      overdueCount += 1;
      if (dl.penaltyPerDay) {
        const daysLate = Math.ceil((now - due) / (24 * 3600 * 1000));
        weeklyExposure += dl.penaltyPerDay * Math.min(daysLate, 30) + dl.penaltyPerDay * 7;
      }
    } else if (due <= horizon) {
      urgentCount += 1;
      if (dl.penaltyPerDay) weeklyExposure += dl.penaltyPerDay * 7;
    }
  }

  return { weeklyExposure: Math.round(weeklyExposure), urgentCount, overdueCount };
}
