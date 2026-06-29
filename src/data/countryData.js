export const COUNTRY_DATA = {
  IN: {
    code: 'IN',
    name: 'India',
    flag: '🇮🇳',
    currency: 'Rs.',
    currencyCode: 'INR',
    taxAuthority: 'GSTN / MCA',
    corpus: 'Indian legal corpus',
    complianceLabel: 'GST Compliance',
    jurisdiction: 'New Delhi, India',
    pricingTiers: {
      basic: '4,999',
      pro: '14,999',
      enterprise: 'Custom'
    },
    landingStats: {
      documentAvg: '4+ hrs',
      complianceRules: '₹18K+',
      penaltyPerDay: '₹50',
      penaltyDesc: 'per day penalty for every late GSTR-3B filing — per client, compounding silently',
      penaltyRisk: '₹50/Day Penalty Risk',
      penaltyRiskDesc: 'One missed GSTR-3B deadline costs ₹18,000+/year per client in compounding fines',
    },
    complianceEvents: {
      '2026-07-15': [{ label: 'GSTR-3B Filing', type: 'GST', status: 'warn' }],
      '2026-07-30': [{ label: 'TDS Return Q1', type: 'TDS', status: 'safe' }],
      '2026-07-07': [{ label: 'Board Meeting Minutes', type: 'MCA', status: 'safe' }],
      '2026-07-20': [{ label: 'PF Challan', type: 'PF', status: 'safe' }],
      '2026-08-15': [{ label: 'GSTR-3B Filing', type: 'GST', status: 'safe' }],
      '2026-09-30': [{ label: 'Annual Return MGT-7', type: 'MCA', status: 'safe' }],
      '2026-10-30': [{ label: 'Financial Statement AOC-4', type: 'MCA', status: 'safe' }],
    },
    compliancePortals: [
      { name: 'MCA V3 Portal', time: '2 mins ago' },
      { name: 'GSTN Portal', time: '15 mins ago' }
    ],
    compliancePenaltyDesc: 'A single missed GSTR-3B costs ₹50/day. One late TDS return invites a ₹200/day penalty under Section 234E.',
    healthCategories: [
      { name: 'Founder Agreement', weight: 20, score: 0, status: 'danger', desc: 'No founder agreement found. This is critical for equity protection.' },
      { name: 'IP Protection', weight: 20, score: 14, status: 'warn', desc: 'Trademark application pending. Code repository assignment missing.' },
      { name: 'DPIIT Registration', weight: 15, score: 15, status: 'safe', desc: 'DPIIT registration complete. Certificate verified.' },
      { name: 'GST Compliance', weight: 10, score: 8, status: 'safe', desc: 'GST registered. Last 2 returns filed on time.' },
      { name: 'Privacy Policy', weight: 10, score: 10, status: 'safe', desc: 'Privacy policy published and compliant with IT Act 2000.' },
      { name: 'Terms & Conditions', weight: 10, score: 7, status: 'warn', desc: 'Terms exist but missing arbitration and governing law clauses.' },
      { name: 'NDA Templates', weight: 10, score: 10, status: 'safe', desc: 'Standard NDA template available and recently updated.' },
      { name: 'Employment Contracts', weight: 5, score: 3, status: 'warn', desc: '2 of 5 employees missing formal contracts.' },
    ],
    contractPlaybook: {
      jurisdictionDesc: 'Jurisdiction is set to Delaware. Your playbook requires Indian jurisdiction (New Delhi).',
      actDesc: 'IT Act 2000'
    },
    ipRegistry: [
      { mark: 'THEMIS', class: 'Class 42', status: 'Registered', date: '12 Jan 2024', registry: 'India (IP India)' },
      { mark: 'THEMIS CLOUD', class: 'Class 9', status: 'Objected', date: '05 May 2026', registry: 'India (IP India)' },
      { mark: 'THEMIS AI', class: 'Class 42', status: 'Published', date: '18 May 2026', registry: 'WIPO (Madrid)' },
    ]
  },
  US: {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    currency: '$',
    currencyCode: 'USD',
    taxAuthority: 'IRS / SEC',
    corpus: 'US federal and state legal corpus',
    complianceLabel: 'Sales Tax Compliance',
    jurisdiction: 'Delaware, USA',
    pricingTiers: {
      basic: '99',
      pro: '299',
      enterprise: 'Custom'
    },
    landingStats: {
      documentAvg: '5+ hrs',
      complianceRules: '$25K+',
      penaltyPerDay: '$210',
      penaltyDesc: 'per month penalty for late partnership return filing — per partner, compounding silently',
      penaltyRisk: '$25K+ Penalty Risk',
      penaltyRiskDesc: 'IRS penalties for late or incorrect corporate filings can exceed $25,000/year per client',
    },
    complianceEvents: {
      '2026-07-15': [{ label: 'Form 941 Q2', type: 'IRS', status: 'warn' }],
      '2026-07-31': [{ label: 'State Sales Tax', type: 'State', status: 'safe' }],
      '2026-08-15': [{ label: 'Form 10-Q', type: 'SEC', status: 'safe' }],
      '2026-09-15': [{ label: 'Estimated Tax Q3', type: 'IRS', status: 'safe' }],
      '2026-10-15': [{ label: 'Form 5500', type: 'DOL', status: 'safe' }],
      '2026-11-01': [{ label: 'Annual Franchise Tax', type: 'State', status: 'safe' }],
      '2026-12-15': [{ label: 'Estimated Tax Q4', type: 'IRS', status: 'safe' }],
    },
    compliancePortals: [
      { name: 'IRS e-file', time: '2 mins ago' },
      { name: 'EDGAR (SEC)', time: '15 mins ago' }
    ],
    compliancePenaltyDesc: 'A single missed Form 941 costs 5% of unpaid tax per month. Late 10-K filings invite severe SEC penalties and market action.',
    healthCategories: [
      { name: 'Operating Agreement', weight: 20, score: 0, status: 'danger', desc: 'No operating agreement found. This is critical for liability protection.' },
      { name: 'IP Protection', weight: 20, score: 14, status: 'warn', desc: 'Trademark application pending. Code repository assignment missing.' },
      { name: 'Delaware Franchise Tax', weight: 15, score: 15, status: 'safe', desc: 'Franchise tax paid and Annual Report filed.' },
      { name: 'Sales Tax Nexus', weight: 10, score: 8, status: 'safe', desc: 'Nexus analyzed. Registered in 3 required states.' },
      { name: 'Privacy Policy', weight: 10, score: 10, status: 'safe', desc: 'Privacy policy published and compliant with CCPA/GDPR.' },
      { name: 'Terms of Service', weight: 10, score: 7, status: 'warn', desc: 'Terms exist but missing mandatory binding arbitration clauses.' },
      { name: 'NDA Templates', weight: 10, score: 10, status: 'safe', desc: 'Standard NDA template available and recently updated.' },
      { name: 'Independent Contractors', weight: 5, score: 3, status: 'warn', desc: '2 of 5 contractors missing formal W-9 and agreements.' },
    ],
    contractPlaybook: {
      jurisdictionDesc: 'Jurisdiction is set to New York. Your playbook requires Delaware jurisdiction.',
      actDesc: 'UCC'
    },
    ipRegistry: [
      { mark: 'THEMIS', class: 'Class 42', status: 'Registered', date: '12 Jan 2024', registry: 'USA (USPTO)' },
      { mark: 'THEMIS CLOUD', class: 'Class 9', status: 'Objected', date: '05 May 2026', registry: 'USA (USPTO)' },
      { mark: 'THEMIS AI', class: 'Class 42', status: 'Published', date: '18 May 2026', registry: 'WIPO (Madrid)' },
    ]
  },
  UK: {
    code: 'UK',
    name: 'United Kingdom',
    flag: '🇬🇧',
    currency: '£',
    currencyCode: 'GBP',
    taxAuthority: 'HMRC / Companies House',
    corpus: 'UK legal corpus',
    complianceLabel: 'VAT Compliance',
    jurisdiction: 'England & Wales',
    pricingTiers: {
      basic: '79',
      pro: '249',
      enterprise: 'Custom'
    },
    landingStats: {
      documentAvg: '4+ hrs',
      complianceRules: '£10K+',
      penaltyPerDay: '£100',
      penaltyDesc: 'immediate penalty for late Company Tax Return, rising over time',
      penaltyRisk: '£100+ Initial Penalty',
      penaltyRiskDesc: 'HMRC penalties escalate quickly, plus 15% surcharge for late VAT payments',
    },
    complianceEvents: {
      '2026-07-07': [{ label: 'VAT Return Q2', type: 'HMRC', status: 'warn' }],
      '2026-07-19': [{ label: 'PAYE/NIC Payment', type: 'HMRC', status: 'safe' }],
      '2026-08-01': [{ label: 'Corporation Tax', type: 'HMRC', status: 'safe' }],
      '2026-09-30': [{ label: 'Confirmation Statement', type: 'Companies House', status: 'safe' }],
      '2026-10-19': [{ label: 'PAYE/NIC Payment', type: 'HMRC', status: 'safe' }],
      '2026-11-07': [{ label: 'VAT Return Q3', type: 'HMRC', status: 'safe' }],
      '2026-12-31': [{ label: 'Annual Accounts', type: 'Companies House', status: 'safe' }],
    },
    compliancePortals: [
      { name: 'HMRC Portal', time: '2 mins ago' },
      { name: 'Companies House', time: '15 mins ago' }
    ],
    compliancePenaltyDesc: 'A missed Confirmation Statement can lead to company strike-off. Late VAT invites immediate surcharges up to 15%.',
    healthCategories: [
      { name: 'Shareholders Agreement', weight: 20, score: 0, status: 'danger', desc: 'No agreement found. This is critical for equity protection.' },
      { name: 'IP Protection', weight: 20, score: 14, status: 'warn', desc: 'Trademark application pending. Code repository assignment missing.' },
      { name: 'Companies House', weight: 15, score: 15, status: 'safe', desc: 'Annual accounts and confirmation statement up to date.' },
      { name: 'VAT Compliance', weight: 10, score: 8, status: 'safe', desc: 'VAT registered. MTD compliance verified.' },
      { name: 'Privacy Policy', weight: 10, score: 10, status: 'safe', desc: 'Privacy policy published and compliant with UK GDPR.' },
      { name: 'Terms of Business', weight: 10, score: 7, status: 'warn', desc: 'Terms exist but missing updated consumer rights clauses.' },
      { name: 'NDA Templates', weight: 10, score: 10, status: 'safe', desc: 'Standard NDA template available and recently updated.' },
      { name: 'Employment Contracts', weight: 5, score: 3, status: 'warn', desc: '2 of 5 employees missing formal Section 1 statements.' },
    ],
    contractPlaybook: {
      jurisdictionDesc: 'Jurisdiction is set to Scotland. Your playbook requires England & Wales jurisdiction.',
      actDesc: 'Companies Act 2006'
    },
    ipRegistry: [
      { mark: 'THEMIS', class: 'Class 42', status: 'Registered', date: '12 Jan 2024', registry: 'UK (UKIPO)' },
      { mark: 'THEMIS CLOUD', class: 'Class 9', status: 'Objected', date: '05 May 2026', registry: 'UK (UKIPO)' },
      { mark: 'THEMIS AI', class: 'Class 42', status: 'Published', date: '18 May 2026', registry: 'WIPO (Madrid)' },
    ]
  },
  DE: {
    code: 'DE',
    name: 'Germany',
    flag: '🇩🇪',
    currency: '€',
    currencyCode: 'EUR',
    taxAuthority: 'Finanzamt / Handelsregister',
    corpus: 'German legal corpus (BGB, HGB)',
    complianceLabel: 'USt-Voranmeldung',
    jurisdiction: 'Berlin, Germany',
    pricingTiers: {
      basic: '89',
      pro: '279',
      enterprise: 'Custom'
    },
    landingStats: {
      documentAvg: '4+ hrs',
      complianceRules: '€25K+',
      penaltyPerDay: '€50',
      penaltyDesc: 'minimum monthly surcharge for late VAT advance returns',
      penaltyRisk: '€25,000 Penalty Risk',
      penaltyRiskDesc: 'Managing directors face personal liability and fines up to €25,000 for late insolvency filing',
    },
    complianceEvents: {
      '2026-07-10': [{ label: 'USt-Voranmeldung', type: 'Finanzamt', status: 'warn' }],
      '2026-07-28': [{ label: 'Sozialversicherung', type: 'Krankenkasse', status: 'safe' }],
      '2026-08-10': [{ label: 'Lohnsteueranmeldung', type: 'Finanzamt', status: 'safe' }],
      '2026-09-10': [{ label: 'Körperschaftsteuer', type: 'Finanzamt', status: 'safe' }],
      '2026-10-10': [{ label: 'USt-Voranmeldung Q3', type: 'Finanzamt', status: 'safe' }],
      '2026-11-28': [{ label: 'Sozialversicherung', type: 'Krankenkasse', status: 'safe' }],
      '2026-12-31': [{ label: 'Jahresabschluss', type: 'Bundesanzeiger', status: 'safe' }],
    },
    compliancePortals: [
      { name: 'ELSTER (Finanzamt)', time: '2 mins ago' },
      { name: 'Unternehmensregister', time: '15 mins ago' }
    ],
    compliancePenaltyDesc: 'Late publishing to the Bundesanzeiger automatically triggers fines starting at €2,500. Missed SV payments lead to criminal liability.',
    healthCategories: [
      { name: 'Gesellschaftsvertrag', weight: 20, score: 0, status: 'danger', desc: 'No articles of association found. Critical for GmbH.' },
      { name: 'IP Protection', weight: 20, score: 14, status: 'warn', desc: 'Trademark application pending. Code repository assignment missing.' },
      { name: 'Handelsregister', weight: 15, score: 15, status: 'safe', desc: 'Commercial register entry is up to date.' },
      { name: 'VAT (USt)', weight: 10, score: 8, status: 'safe', desc: 'VAT ID issued. Advance returns filed on time.' },
      { name: 'Datenschutzerklärung', weight: 10, score: 10, status: 'safe', desc: 'Privacy policy published and GDPR compliant.' },
      { name: 'AGB (Terms)', weight: 10, score: 7, status: 'warn', desc: 'Terms exist but missing required consumer cancellation rights (Widerrufsrecht).' },
      { name: 'NDA Templates', weight: 10, score: 10, status: 'safe', desc: 'Standard NDA template available and recently updated.' },
      { name: 'Arbeitsverträge', weight: 5, score: 3, status: 'warn', desc: '2 of 5 employees missing formal written contracts.' },
    ],
    contractPlaybook: {
      jurisdictionDesc: 'Jurisdiction is set to Munich. Your playbook requires Berlin jurisdiction.',
      actDesc: 'BGB'
    },
    ipRegistry: [
      { mark: 'THEMIS', class: 'Class 42', status: 'Registered', date: '12 Jan 2024', registry: 'Germany (DPMA)' },
      { mark: 'THEMIS CLOUD', class: 'Class 9', status: 'Objected', date: '05 May 2026', registry: 'Germany (DPMA)' },
      { mark: 'THEMIS AI', class: 'Class 42', status: 'Published', date: '18 May 2026', registry: 'WIPO (Madrid)' },
    ]
  },
  AE: {
    code: 'AE',
    name: 'UAE',
    flag: '🇦🇪',
    currency: 'AED ',
    currencyCode: 'AED',
    taxAuthority: 'FTA / DED',
    corpus: 'UAE Federal Laws & Free Zone Regulations',
    complianceLabel: 'VAT & Corporate Tax',
    jurisdiction: 'Dubai (DIFC), UAE',
    pricingTiers: {
      basic: '299',
      pro: '899',
      enterprise: 'Custom'
    },
    landingStats: {
      documentAvg: '4+ hrs',
      complianceRules: 'AED 20K+',
      penaltyPerDay: 'AED 1,000',
      penaltyDesc: 'penalty for first time late VAT return, increasing to AED 2,000',
      penaltyRisk: 'AED 20K Penalty Risk',
      penaltyRiskDesc: 'Corporate tax registration delays cost AED 10,000, plus mounting VAT fines',
    },
    complianceEvents: {
      '2026-07-28': [{ label: 'VAT Return', type: 'FTA', status: 'warn' }],
      '2026-08-15': [{ label: 'WPS Salary Transfer', type: 'MOHRE', status: 'safe' }],
      '2026-09-30': [{ label: 'ESR Notification', type: 'MoF', status: 'safe' }],
      '2026-10-31': [{ label: 'License Renewal', type: 'DED/Free Zone', status: 'safe' }],
      '2026-11-28': [{ label: 'VAT Return', type: 'FTA', status: 'safe' }],
      '2026-12-31': [{ label: 'Corporate Tax Return', type: 'FTA', status: 'safe' }],
    },
    compliancePortals: [
      { name: 'EmaraTax (FTA)', time: '2 mins ago' },
      { name: 'MoF Portal', time: '15 mins ago' }
    ],
    compliancePenaltyDesc: 'Late VAT returns incur AED 1,000/2,000 fines. Failure to submit Economic Substance Regulations (ESR) reports costs AED 50,000.',
    healthCategories: [
      { name: 'Memorandum of Association', weight: 20, score: 0, status: 'danger', desc: 'No MoA found. Critical for mainland LLCs.' },
      { name: 'IP Protection', weight: 20, score: 14, status: 'warn', desc: 'Trademark application pending. Code repository assignment missing.' },
      { name: 'Trade License', weight: 15, score: 15, status: 'safe', desc: 'Trade license valid and activities aligned.' },
      { name: 'Tax Compliance', weight: 10, score: 8, status: 'safe', desc: 'VAT & CT registered. Returns filed on time.' },
      { name: 'Privacy Policy', weight: 10, score: 10, status: 'safe', desc: 'Privacy policy published and compliant with UAE Data Protection Law.' },
      { name: 'Terms & Conditions', weight: 10, score: 7, status: 'warn', desc: 'Terms exist but missing DIFC governing law clauses.' },
      { name: 'NDA Templates', weight: 10, score: 10, status: 'safe', desc: 'Standard NDA template available and recently updated.' },
      { name: 'Employment Contracts', weight: 5, score: 3, status: 'warn', desc: '2 of 5 employees missing MOHRE standard contracts.' },
    ],
    contractPlaybook: {
      jurisdictionDesc: 'Jurisdiction is set to ADGM. Your playbook requires DIFC jurisdiction.',
      actDesc: 'UAE Civil Code'
    },
    ipRegistry: [
      { mark: 'THEMIS', class: 'Class 42', status: 'Registered', date: '12 Jan 2024', registry: 'UAE (MoE)' },
      { mark: 'THEMIS CLOUD', class: 'Class 9', status: 'Objected', date: '05 May 2026', registry: 'UAE (MoE)' },
      { mark: 'THEMIS AI', class: 'Class 42', status: 'Published', date: '18 May 2026', registry: 'WIPO (Madrid)' },
    ]
  },
  SG: {
    code: 'SG',
    name: 'Singapore',
    flag: '🇸🇬',
    currency: 'S$',
    currencyCode: 'SGD',
    taxAuthority: 'IRAS / ACRA',
    corpus: 'Singapore legal corpus',
    complianceLabel: 'GST & ACRA Compliance',
    jurisdiction: 'Singapore',
    pricingTiers: {
      basic: '129',
      pro: '399',
      enterprise: 'Custom'
    },
    landingStats: {
      documentAvg: '4+ hrs',
      complianceRules: 'S$5K+',
      penaltyPerDay: 'S$200',
      penaltyDesc: 'penalty for late GST return, plus 5% surcharge on tax due',
      penaltyRisk: 'S$5,000+ Penalty Risk',
      penaltyRiskDesc: 'Late ACRA annual returns and ECI filings trigger compound fines and potential court prosecution',
    },
    complianceEvents: {
      '2026-07-31': [{ label: 'GST Return Q2', type: 'IRAS', status: 'warn' }],
      '2026-08-14': [{ label: 'CPF Contributions', type: 'CPFB', status: 'safe' }],
      '2026-09-30': [{ label: 'Estimated Chargeable Income', type: 'IRAS', status: 'safe' }],
      '2026-10-31': [{ label: 'GST Return Q3', type: 'IRAS', status: 'safe' }],
      '2026-11-30': [{ label: 'Form C-S/C', type: 'IRAS', status: 'safe' }],
      '2026-12-31': [{ label: 'Annual Return', type: 'ACRA', status: 'safe' }],
    },
    compliancePortals: [
      { name: 'myTax Portal (IRAS)', time: '2 mins ago' },
      { name: 'BizFile+ (ACRA)', time: '15 mins ago' }
    ],
    compliancePenaltyDesc: 'Directors face up to S$5,000 in fines and disqualification for failing to hold AGMs or file ACRA returns on time.',
    healthCategories: [
      { name: 'Shareholders Agreement', weight: 20, score: 0, status: 'danger', desc: 'No agreement found. Critical for equity protection.' },
      { name: 'IP Protection', weight: 20, score: 14, status: 'warn', desc: 'Trademark application pending. Code repository assignment missing.' },
      { name: 'ACRA Records', weight: 15, score: 15, status: 'safe', desc: 'Registers of Controllers and Directors up to date.' },
      { name: 'Tax Compliance', weight: 10, score: 8, status: 'safe', desc: 'ECI filed. GST returns submitted.' },
      { name: 'Privacy Policy', weight: 10, score: 10, status: 'safe', desc: 'Privacy policy published and compliant with PDPA.' },
      { name: 'Terms & Conditions', weight: 10, score: 7, status: 'warn', desc: 'Terms exist but missing SIAC arbitration clauses.' },
      { name: 'NDA Templates', weight: 10, score: 10, status: 'safe', desc: 'Standard NDA template available and recently updated.' },
      { name: 'Employment Contracts', weight: 5, score: 3, status: 'warn', desc: '2 of 5 employees missing MOM Key Employment Terms.' },
    ],
    contractPlaybook: {
      jurisdictionDesc: 'Jurisdiction is set to England. Your playbook requires Singapore jurisdiction.',
      actDesc: 'Electronic Transactions Act'
    },
    ipRegistry: [
      { mark: 'THEMIS', class: 'Class 42', status: 'Registered', date: '12 Jan 2024', registry: 'Singapore (IPOS)' },
      { mark: 'THEMIS CLOUD', class: 'Class 9', status: 'Objected', date: '05 May 2026', registry: 'Singapore (IPOS)' },
      { mark: 'THEMIS AI', class: 'Class 42', status: 'Published', date: '18 May 2026', registry: 'WIPO (Madrid)' },
    ]
  },
  AU: {
    code: 'AU',
    name: 'Australia',
    flag: '🇦🇺',
    currency: 'A$',
    currencyCode: 'AUD',
    taxAuthority: 'ATO / ASIC',
    corpus: 'Australian legal corpus',
    complianceLabel: 'BAS & ASIC Compliance',
    jurisdiction: 'New South Wales, Australia',
    pricingTiers: {
      basic: '149',
      pro: '449',
      enterprise: 'Custom'
    },
    landingStats: {
      documentAvg: '4+ hrs',
      complianceRules: 'A$15K+',
      penaltyPerDay: 'A$313',
      penaltyDesc: 'penalty unit for every 28 days a tax document is late, accumulating fast',
      penaltyRisk: 'A$15,000+ Penalty Risk',
      penaltyRiskDesc: 'Directors face personal liability (DPNs) for unpaid PAYG and superannuation',
    },
    complianceEvents: {
      '2026-07-21': [{ label: 'Payroll Tax', type: 'State', status: 'warn' }],
      '2026-07-28': [{ label: 'Super Guarantee Q2', type: 'ATO', status: 'safe' }],
      '2026-08-28': [{ label: 'BAS Q2', type: 'ATO', status: 'safe' }],
      '2026-09-30': [{ label: 'Annual Review Fee', type: 'ASIC', status: 'safe' }],
      '2026-10-21': [{ label: 'Payroll Tax', type: 'State', status: 'safe' }],
      '2026-10-28': [{ label: 'Super Guarantee Q3', type: 'ATO', status: 'safe' }],
      '2026-11-28': [{ label: 'BAS Q3', type: 'ATO', status: 'safe' }],
    },
    compliancePortals: [
      { name: 'ATO Online Services', time: '2 mins ago' },
      { name: 'ASIC Connect', time: '15 mins ago' }
    ],
    compliancePenaltyDesc: 'Failure to lodge BAS or pay superannuation triggers Director Penalty Notices, making you personally liable.',
    healthCategories: [
      { name: 'Shareholders Agreement', weight: 20, score: 0, status: 'danger', desc: 'No agreement found. Critical for equity protection.' },
      { name: 'IP Protection', weight: 20, score: 14, status: 'warn', desc: 'Trademark application pending. Code repository assignment missing.' },
      { name: 'ASIC Registers', weight: 15, score: 15, status: 'safe', desc: 'Company registers and annual review up to date.' },
      { name: 'Tax & Super', weight: 10, score: 8, status: 'safe', desc: 'PAYG and Super Guarantee obligations met.' },
      { name: 'Privacy Policy', weight: 10, score: 10, status: 'safe', desc: 'Privacy policy published and compliant with Privacy Act 1988.' },
      { name: 'Terms & Conditions', weight: 10, score: 7, status: 'warn', desc: 'Terms exist but missing Australian Consumer Law (ACL) guarantees.' },
      { name: 'NDA Templates', weight: 10, score: 10, status: 'safe', desc: 'Standard NDA template available and recently updated.' },
      { name: 'Employment Contracts', weight: 5, score: 3, status: 'warn', desc: '2 of 5 employees missing National Employment Standards (NES) info.' },
    ],
    contractPlaybook: {
      jurisdictionDesc: 'Jurisdiction is set to Victoria. Your playbook requires New South Wales jurisdiction.',
      actDesc: 'Corporations Act 2001'
    },
    ipRegistry: [
      { mark: 'THEMIS', class: 'Class 42', status: 'Registered', date: '12 Jan 2024', registry: 'Australia (IP Australia)' },
      { mark: 'THEMIS CLOUD', class: 'Class 9', status: 'Objected', date: '05 May 2026', registry: 'Australia (IP Australia)' },
      { mark: 'THEMIS AI', class: 'Class 42', status: 'Published', date: '18 May 2026', registry: 'WIPO (Madrid)' },
    ]
  },
  CA: {
    code: 'CA',
    name: 'Canada',
    flag: '🇨🇦',
    currency: 'C$',
    currencyCode: 'CAD',
    taxAuthority: 'CRA / Corporations Canada',
    corpus: 'Canadian legal corpus',
    complianceLabel: 'GST/HST Compliance',
    jurisdiction: 'Ontario, Canada',
    pricingTiers: {
      basic: '129',
      pro: '399',
      enterprise: 'Custom'
    },
    landingStats: {
      documentAvg: '4+ hrs',
      complianceRules: 'C$10K+',
      penaltyPerDay: 'C$250',
      penaltyDesc: 'failure to file penalty, plus 5% of unpaid tax and 1% per month',
      penaltyRisk: 'C$10,000+ Penalty Risk',
      penaltyRiskDesc: 'CRA penalties for late T2 returns and missed payroll remittances compound rapidly',
    },
    complianceEvents: {
      '2026-07-15': [{ label: 'Payroll Remittance', type: 'CRA', status: 'warn' }],
      '2026-07-31': [{ label: 'GST/HST Return', type: 'CRA', status: 'safe' }],
      '2026-08-15': [{ label: 'Payroll Remittance', type: 'CRA', status: 'safe' }],
      '2026-09-30': [{ label: 'Corporate Tax (T2) Bal.', type: 'CRA', status: 'safe' }],
      '2026-10-31': [{ label: 'Annual Return', type: 'Corp Canada', status: 'safe' }],
      '2026-12-31': [{ label: 'Corporate Tax (T2)', type: 'CRA', status: 'safe' }],
    },
    compliancePortals: [
      { name: 'CRA My Business Account', time: '2 mins ago' },
      { name: 'Corporations Canada', time: '15 mins ago' }
    ],
    compliancePenaltyDesc: 'Missing an Annual Return filing leads to corporate dissolution. Late payroll remittances face penalties up to 20%.',
    healthCategories: [
      { name: 'USA (Shareholders)', weight: 20, score: 0, status: 'danger', desc: 'No Unanimous Shareholders Agreement found. Critical.' },
      { name: 'IP Protection', weight: 20, score: 14, status: 'warn', desc: 'Trademark application pending. Code repository assignment missing.' },
      { name: 'Corporate Minute Book', weight: 15, score: 15, status: 'safe', desc: 'Minute book updated and resolutions signed.' },
      { name: 'GST/HST & Payroll', weight: 10, score: 8, status: 'safe', desc: 'Registered for GST/HST and payroll accounts.' },
      { name: 'Privacy Policy', weight: 10, score: 10, status: 'safe', desc: 'Privacy policy published and PIPEDA compliant.' },
      { name: 'Terms of Service', weight: 10, score: 7, status: 'warn', desc: 'Terms exist but missing Quebec consumer protection adaptations.' },
      { name: 'NDA Templates', weight: 10, score: 10, status: 'safe', desc: 'Standard NDA template available and recently updated.' },
      { name: 'Employment Contracts', weight: 5, score: 3, status: 'warn', desc: '2 of 5 employees missing ESA compliant contracts.' },
    ],
    contractPlaybook: {
      jurisdictionDesc: 'Jurisdiction is set to British Columbia. Your playbook requires Ontario jurisdiction.',
      actDesc: 'CBCA'
    },
    ipRegistry: [
      { mark: 'THEMIS', class: 'Class 42', status: 'Registered', date: '12 Jan 2024', registry: 'Canada (CIPO)' },
      { mark: 'THEMIS CLOUD', class: 'Class 9', status: 'Objected', date: '05 May 2026', registry: 'Canada (CIPO)' },
      { mark: 'THEMIS AI', class: 'Class 42', status: 'Published', date: '18 May 2026', registry: 'WIPO (Madrid)' },
    ]
  }
};
