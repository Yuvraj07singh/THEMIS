import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useCountry } from '../../contexts/CountryContext';
import Button from '../ui/Button';
import ScoreRing from '../ui/ScoreRing';
import Card from '../ui/Card';
import './Landing.css';

/* ---- Mock Data ---- */

const DOCUMENT_TYPES = [
  'Founder Agreement',
  'Non-Disclosure Agreement',
  'Employment Contract',
  'Privacy Policy',
  'Terms of Service',
  'Shareholders Agreement',
];

export default function Landing() {
  const { country } = useCountry();
  const pageRef = useRef(null);
  useScrollReveal(pageRef);
  const [ctaEmail, setCtaEmail] = useState('');
  const [ctaSubmitted, setCtaSubmitted] = useState(false);

  const [typedLine1, setTypedLine1] = useState('');
  const [typedLine2, setTypedLine2] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const FULL_LINE_1 = 'The cognitive engine for';
  const FULL_LINE_2 = 'elite legal teams.';

  useEffect(() => {
    let index1 = 0;
    let index2 = 0;

    const intervalId1 = setInterval(() => {
      if (index1 < FULL_LINE_1.length) {
        setTypedLine1(FULL_LINE_1.slice(0, index1 + 1));
        index1++;
      } else {
        clearInterval(intervalId1);
        const intervalId2 = setInterval(() => {
          if (index2 < FULL_LINE_2.length) {
            setTypedLine2(FULL_LINE_2.slice(0, index2 + 1));
            index2++;
          } else {
            clearInterval(intervalId2);
            setTimeout(() => {
              setIsTypingComplete(true);
            }, 300);
          }
        }, 25);
      }
    }, 25);

    return () => {
      clearInterval(intervalId1);
    };
  }, []);

  return (
    <div ref={pageRef} className="landing">
      {/* ============================================================
          SECTION 1: HERO
          Psychology: Clear value prop in under 5 seconds (Hick's Law).
          Single CTA eliminates decision paralysis.
          ============================================================ */}
      <section className={`hero ${isTypingComplete ? 'hero--revealed' : 'hero--animating'}`} id="hero">
        <div className="hero__glow" aria-hidden="true" />
        <div className="hero__grid-bg" aria-hidden="true" />
        <div className="container hero__content">
          <span className="hero__badge">
            AI-Powered Legal Operating System
          </span>
          <h1 className="hero__title">
            {typedLine1}<br />
            <span className="text-gold">{typedLine2}</span>
            <span className="hero__cursor" style={{ opacity: isTypingComplete ? 0 : 1, color: 'var(--gold-primary)', marginLeft: '4px' }}>|</span>
          </h1>
          <p className="hero__subtitle">
            GST notice replies in minutes, every deadline tracked, contracts checked
            against your playbook. Trained on {country.corpus}. Citation-verified —
            zero hallucination architecture.
          </p>
          <div className="hero__actions">
            <Button as={Link} to="/signup" variant="primary" size="lg">
              Get Started
            </Button>
            <Button as={Link} to="/login" variant="secondary" size="lg">
              Log in
            </Button>
          </div>
          <div className="hero__proof">
            <span className="hero__proof-stat">
              <strong>10 min</strong> notice reply drafts
            </span>
            <span className="hero__proof-divider" />
            <span className="hero__proof-stat">
              <strong>100%</strong> citations machine-verified
            </span>
            <span className="hero__proof-divider" />
            <span className="hero__proof-stat">
              <strong>{country.landingStats.complianceRules}</strong> penalty risk eliminated per client/year
            </span>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 2: PROBLEM STATEMENT
          Psychology: Loss aversion -- framing the cost of inaction
          before showing the solution.
          ============================================================ */}
      <section className="section section-alt" id="problem">
        <div className="container">
          <div className="problem__grid">
            <div className="problem__text">
              <span className="text-label reveal">The Bottleneck</span>
              <h2 className="reveal" data-delay="0.08">
                Traditional firms are<br />
                <span className="text-gold">choking on manual work.</span>
              </h2>
              <div className="problem__stats">
                <div className="problem__stat reveal" data-delay="0.16">
                  <span className="problem__stat-number">{country.landingStats.documentAvg.split('+')[0]}+</span>
                  <p>hours per week per lawyer wasted on manual research, drafting, and data entry</p>
                </div>
                <div className="problem__stat reveal" data-delay="0.24">
                  <span className="problem__stat-number">{country.landingStats.penaltyPerDay}</span>
                  <p>{country.landingStats.penaltyDesc}</p>
                </div>
                <div className="problem__stat reveal" data-delay="0.32">
                  <span className="problem__stat-number">100%</span>
                  <p>liability exposure when using generic AI that hallucinates section numbers and case citations</p>
                </div>
              </div>
            </div>
            <div className="problem__visual reveal-right" data-delay="0.2">
              <div className="problem__illustration">
                <div className="problem__risk-card">
                  <span className="problem__risk-icon problem__risk-icon--danger" />
                  <div>
                    <strong>Unscalable Processes</strong>
                    <p>Every new client needs a new hire — margins shrink as you grow</p>
                  </div>
                </div>
                <div className="problem__risk-card">
                  <span className="problem__risk-icon problem__risk-icon--warn" />
                  <div>
                    <strong>{country.landingStats.penaltyRisk}</strong>
                    <p>{country.landingStats.penaltyRiskDesc}</p>
                  </div>
                </div>
                <div className="problem__risk-card">
                  <span className="problem__risk-icon problem__risk-icon--danger" />
                  <div>
                    <strong>ChatGPT Cites Fake Laws</strong>
                    <p>Public LLMs hallucinate section numbers, violating attorney-client privilege</p>
                  </div>
                </div>
                <div className="problem__risk-card">
                  <span className="problem__risk-icon problem__risk-icon--warn" />
                  <div>
                    <strong>Clients Expect Portals</strong>
                    <p>Modern clients demand real-time dashboards, not email chains and PDFs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 3: CLIENT CRM
          Psychology: Dashboard view gives firm partners a sense of
          control and identifies upsell opportunities.
          ============================================================ */}
      <section className="section" id="features">
        <div className="container">
          <div className="section-header">
            <span className="text-label reveal">Core Feature</span>
            <h2 className="reveal" data-delay="0.08">
              Client Portfolio CRM
            </h2>
            <p className="reveal" data-delay="0.16">
              A comprehensive master dashboard to monitor the legal health of
              all your startup clients in one place. Identify compliance risks
              and proactively offer services.
            </p>
          </div>

          <div className="health-score__layout">
            <div className="health-score__ring reveal" data-delay="0.1">
              <ScoreRing score={country.healthCategories.reduce((sum, c) => sum + c.score, 0)} size={240} strokeWidth={12} />
              <p className="health-score__verdict">Needs Attention</p>
            </div>
            <div className="health-score__categories">
              {country.healthCategories.map((cat, i) => (
                <div
                  key={cat.name}
                  className="health-score__category reveal"
                  data-delay={String(0.1 + i * 0.06)}
                >
                  <div className="health-score__category-header">
                    <span className={`health-score__dot health-score__dot--${cat.status}`} />
                    <span className="health-score__category-name">{cat.name}</span>
                    <span className="health-score__category-weight">{cat.weight}pts</span>
                  </div>
                  <div className="health-score__bar">
                    <div
                      className={`health-score__bar-fill health-score__bar-fill--${cat.status}`}
                      style={{ width: `${(cat.score / cat.weight) * 100}%` }}
                    />
                  </div>
                  <span className="health-score__category-score">
                    {cat.score}/{cat.weight}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 4: AI CONTRACT REVIEW (SpotDraft clone features)
          Psychology: Margin multiplier. Show firms how AI replaces
          manual review hours.
          ============================================================ */}
      <section className="section section-alt sticky-section" id="documents">
        <div className="container grid-2">
          
          <div className="sticky-section__text">
            <div className="sticky-timeline-step">
              <span className="text-label reveal">Contract Lifecycle Management</span>
              <h2 className="reveal" data-delay="0.08">
                Review 50-page contracts<br />
                <span className="text-gold">in 30 seconds.</span>
              </h2>
              <p className="reveal" data-delay="0.16">
                Upload contracts from opposing counsel. Themis AI reads the document,
                flags critical deviations from your firm's custom playbook, and suggests
                instant redlines.
              </p>
            </div>

            <div className="sticky-timeline-step">
              <h2>
                Enforce the <span className="text-gold">Playbook.</span>
              </h2>
              <p>
                When a clause violates your parameters (e.g., Jurisdiction set to Delaware instead of India), Themis flags it and drafts a counter-clause automatically.
              </p>
            </div>
            
            <div className="sticky-timeline-step sticky-timeline-step--last">
              <h2>
                Export with <span className="text-gold">Confidence.</span>
              </h2>
              <p>
                Approve or reject redlines with a single click. Download the fully marked-up Word document ready to be sent back to opposing counsel.
              </p>
            </div>
          </div>

          <div className="sticky-section__visual">
            <div className="docgen__preview reveal" data-delay="0.1">
              <div className="docgen__sidebar-mock" style={{ flex: 1, padding: 'var(--space-6)' }}>
                <span className="text-label" style={{ marginBottom: 'var(--space-4)', display: 'block' }}>Playbook Deviations</span>
                <div style={{ padding: 'var(--space-4)', background: 'var(--bg-void)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--status-danger)' }}>CLAUSE 2: TERM</span>
                  </div>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', marginBottom: 'var(--space-3)' }}>
                    "In perpetuity" violates playbook limit of 3 years.
                  </p>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <Button variant="primary" size="sm" style={{ flex: 1 }}>Accept Redline</Button>
                  </div>
                </div>
                <div style={{ padding: 'var(--space-4)', background: 'var(--bg-void)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--status-warn)' }}>CLAUSE 3: JURISDICTION</span>
                  </div>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                    Jurisdiction set to Delaware. Playbook requires India.
                  </p>
                </div>
              </div>
              <div className="docgen__output-mock" style={{ flex: 1.5 }}>
                <div className="docgen__output-header">
                  <span className="docgen__output-title">Vendor Agreement_v2.docx</span>
                </div>
                <div className="docgen__output-body">
                  <p className="text-legal">
                    <strong>2. Term and Termination</strong>
                  </p>
                  <p className="text-legal" style={{ background: 'rgba(231, 76, 60, 0.1)', padding: '4px', borderLeft: '2px solid var(--status-danger)' }}>
                    The obligations of confidentiality under this Agreement shall survive termination and remain in effect <strong style={{ color: 'var(--status-danger)', textDecoration: 'line-through' }}>in perpetuity</strong> <strong style={{ color: 'var(--status-safe)' }}>for three (3) years</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 5: IP REGISTRY WATCH (MikeLegal clone features)
          ============================================================ */}
      <section className="section" id="ip-watch">
        <div className="container">
          <div className="section-header">
            <span className="text-label reveal">IP Protection</span>
            <h2 className="reveal" data-delay="0.08">
              Live Trademark Tracking.<br />
              <span className="text-gold">Zero missed infringements.</span>
            </h2>
            <p className="reveal" data-delay="0.16">
              Themis directly syncs with IP India and WIPO registries. Monitor your entire client portfolio for status changes and get alerted instantly when competitors try to file confusingly similar marks.
            </p>
          </div>
        </div>
      </section>



      {/* ============================================================
          SECTION 6: COMPLIANCE CALENDAR
          Psychology: Loss aversion -- fear of penalties and missed
          deadlines drives action.
          ============================================================ */}
      <section className="section section-alt" id="compliance">
        <div className="container">
          <div className="section-header">
            <span className="text-label reveal">Compliance Calendar</span>
            <h2 className="reveal" data-delay="0.08">
              Live MCA & GSTN APIs.<br />
              <span className="text-gold">Zero manual tracking.</span>
            </h2>
            <p className="reveal" data-delay="0.16">
              A single missed GSTR-3B costs ₹50/day. One late TDS return invites a ₹200/day penalty under Section 234E.
              Themis syncs directly with MCA and GSTN portals, sends WhatsApp alerts
              under your firm's branding, and eliminates manual deadline tracking entirely.
            </p>
          </div>

          <div className="compliance-preview reveal" data-delay="0.1">
            <div className="compliance-preview__timeline">
              {Object.entries(country.complianceEvents)
                .flatMap(([date, events]) => events.map(event => ({
                  date: new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
                  label: event.label,
                  status: event.status,
                  daysLeft: Math.max(0, Math.ceil((new Date(date) - new Date('2026-07-01')) / (1000 * 60 * 60 * 24)))
                })))
                .sort((a, b) => a.daysLeft - b.daysLeft)
                .slice(0, 4)
                .map((event, i) => (
                <div key={i} className="compliance-preview__item">
                  <div className="compliance-preview__date">
                    <span className={`compliance-preview__dot compliance-preview__dot--${event.status}`} />
                    {event.date}
                  </div>
                  <div className="compliance-preview__details">
                    <strong>{event.label}</strong>
                    <span className={`compliance-preview__countdown compliance-preview__countdown--${event.status}`}>
                      {event.daysLeft} days remaining
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="compliance-preview__alerts">
              <Card variant="default">
                <div className="compliance-preview__alert-header">
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--status-safe)', animation: 'blink 2s infinite' }} />
                  <strong>Live Portal Sync</strong>
                </div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-3)' }}>
                  MCA V3 and GSTN portals are connected. Filing statuses update in real-time.
                </p>
                <div className="compliance-preview__whatsapp-mock">
                  <div className="compliance-preview__msg">
                    <span className="compliance-preview__msg-sender">Shah & Associates</span>
                    <p>Hi, a reminder from Shah & Associates that your GSTR-3B filing is due in 7 days (15 Jul 2026). Tap to view details.</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 7: FOR FIRMS (White-Label)
          Psychology: Identity projection -- firms see themselves
          in the product immediately.
          ============================================================ */}
      <section className="section" id="firms">
        <div className="container">
          <div className="firms__layout">
            <div className="firms__text">
              <span className="text-label reveal">For CA & Law Firms</span>
              <h2 className="reveal" data-delay="0.08">
                Your brand.<br />
                <span className="text-gold">Our engine.</span>
              </h2>
              <p className="reveal" data-delay="0.16">
                White-label Themis under your firm's identity. Custom logo,
                colors, and domain. Your clients see your brand -- powered
                by Themis intelligence underneath.
              </p>
              <ul className="firms__features reveal" data-delay="0.24">
                <li>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8l3 3 7-7" stroke="var(--gold-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Multi-client management dashboard
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8l3 3 7-7" stroke="var(--gold-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  AI Contract Redlining & Playbooks
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8l3 3 7-7" stroke="var(--gold-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Custom branding and domain
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8l3 3 7-7" stroke="var(--gold-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  API access for integrations
                </li>
              </ul>
              <Button as={Link} to="/signup" variant="secondary" size="md" className="reveal" data-delay="0.32">
                Schedule a Demo
              </Button>
            </div>
            <div className="firms__visual reveal-right" data-delay="0.2">
              <div className="firms__brand-demo">
                <div className="firms__brand-card firms__brand-card--themis">
                  <div className="firms__brand-header">
                    <span className="firms__brand-logo" style={{ background: 'var(--gold-primary)' }}>T</span>
                    <span>Themis Portal</span>
                  </div>
                  <div className="firms__brand-body">
                    <div className="firms__brand-bar" style={{ background: 'var(--gold-primary)', width: '70%' }} />
                    <div className="firms__brand-bar" style={{ background: 'var(--gold-glow)', width: '50%' }} />
                    <div className="firms__brand-bar" style={{ background: 'var(--gold-glow)', width: '85%' }} />
                  </div>
                </div>
                <div className="firms__brand-arrow">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="firms__brand-card firms__brand-card--custom">
                  <div className="firms__brand-header">
                    <span className="firms__brand-logo" style={{ background: '#4A90D9' }}>S</span>
                    <span>Shah & Associates</span>
                  </div>
                  <div className="firms__brand-body">
                    <div className="firms__brand-bar" style={{ background: '#4A90D9', width: '70%' }} />
                    <div className="firms__brand-bar" style={{ background: 'rgba(74, 144, 217, 0.2)', width: '50%' }} />
                    <div className="firms__brand-bar" style={{ background: 'rgba(74, 144, 217, 0.2)', width: '85%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 8: TRUST & SECURITY
          Psychology: Trust signals placed before pricing to reduce
          objections at the decision point.
          ============================================================ */}
      <section className="section section-alt" id="trust">
        <div className="container">
          <div className="section-header">
            <span className="text-label reveal">Trust & Security</span>
            <h2 className="reveal" data-delay="0.08">
              Built on accuracy.<br />
              <span className="text-gold">Not assumptions.</span>
            </h2>
          </div>

          <div className="trust__grid grid grid-3">
            <Card variant="default" className="trust__card reveal" data-delay="0.1">
              <div className="trust__icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M16 3L28 9v8c0 7-5 11.5-12 13.5C9 28.5 4 24 4 17V9L16 3z" stroke="var(--gold-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M11 16l4 4 6-6" stroke="var(--gold-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h4>Zero Hallucination Target</h4>
              <p>Fine-tuned on actual Indian legal corpus -- Central Acts,
                High Court judgements, and regulatory guidelines. Every
                section number is verified against source.</p>
            </Card>

            <Card variant="default" className="trust__card reveal" data-delay="0.18">
              <div className="trust__icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect x="4" y="8" width="24" height="16" rx="3" stroke="var(--gold-primary)" strokeWidth="2" />
                  <path d="M4 14h24" stroke="var(--gold-primary)" strokeWidth="2" />
                  <circle cx="9" cy="20" r="1.5" fill="var(--gold-primary)" />
                </svg>
              </div>
              <h4>End-to-End Encryption</h4>
              <p>All documents and company data encrypted at rest and in
                transit. Your legal information never leaves your control.</p>
            </Card>

            <Card variant="default" className="trust__card reveal" data-delay="0.26">
              <div className="trust__icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M6 28V14l10-8 10 8v14" stroke="var(--gold-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 28v-8h8v8" stroke="var(--gold-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h4>{country.name} Legal Corpus</h4>
              <p>Trained on {country.corpus}. Section-aware chunking
                prevents clause truncation.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 9: PRICING
          Psychology: Anchoring bias -- Professional tier is highlighted
          to anchor value. Firm tier sets the ceiling.
          ============================================================ */}
      <section className="section" id="pricing">
        <div className="container">
          <div className="section-header">
            <span className="text-label reveal">Pricing</span>
            <h2 className="reveal" data-delay="0.08">
              Legal infrastructure that<br />
              <span className="text-gold">pays for itself.</span>
            </h2>
            <p className="reveal" data-delay="0.16">
              A single month of Themis costs less than the billable hours
              wasted on a single manual contract draft.
            </p>
          </div>

          <div className="pricing__grid">
            {[
              {
                name: 'Solo Practice',
                price: country.pricingTiers.basic,
                period: '/month',
                description: 'For independent CAs and lawyers managing up to 50 clients.',
                features: [
                  'Client Portfolio CRM',
                  'AI Document Assembly (50/mo)',
                  'Automated Compliance Alerts',
                  'Standard Support',
                ],
                cta: 'Start Free Trial',
                variant: 'secondary',
              },
              {
                name: 'Growing Firm',
                price: country.pricingTiers.pro,
                period: '/month',
                description: 'For mid-sized firms that need white-labeling and scale.',
                features: [
                  'Everything in Solo Practice',
                  'Unlimited Clients',
                  'White-label Client Portal',
                  'Custom Branding & Domain',
                  'Priority Support',
                ],
                cta: 'Start Free Trial',
                variant: 'primary',
                highlighted: true,
              },
              {
                name: 'Enterprise',
                price: country.pricingTiers.enterprise,
                period: '',
                description: 'For large legal enterprises requiring custom integrations.',
                features: [
                  'Everything in Growing Firm',
                  'Custom AI Template Training',
                  'API Access',
                  'On-premise Deployment Options',
                  'Dedicated Account Manager',
                ],
                cta: 'Contact Sales',
                variant: 'secondary',
              },
            ].map((tier, i) => (
              <div
                key={tier.name}
                className={`pricing__card reveal ${tier.highlighted ? 'pricing__card--highlighted' : ''}`}
                data-delay={String(0.1 + i * 0.08)}
              >
                {tier.highlighted && (
                  <span className="pricing__popular">Most Popular</span>
                )}
                <h4 className="pricing__name">{tier.name}</h4>
                <p className="pricing__description">{tier.description}</p>
                <div className="pricing__price">
                  <span className="pricing__currency">{country.currency}</span>
                  <span className="pricing__amount">{tier.price}</span>
                  <span className="pricing__period">{tier.period}</span>
                </div>
                <ul className="pricing__features">
                  {tier.features.map((feature) => (
                    <li key={feature}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8l3 3 7-7" stroke="var(--gold-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  as={Link}
                  to="/signup"
                  variant={tier.variant}
                  size="md"
                  style={{ width: '100%' }}
                >
                  {tier.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 10: FINAL CTA
          Psychology: The closing zone -- distraction-free environment,
          reiteration of core value.
          ============================================================ */}
      <section className="section final-cta" id="cta">
        <div className="final-cta__glow" aria-hidden="true" />
        <div className="container final-cta__content">
          <h2 className="reveal">
            Your firm deserves<br />
            <span className="text-gold">a modern engine.</span>
          </h2>
          <p className="reveal" data-delay="0.1">
            Join the forward-thinking CAs and lawyers who stopped doing manual
            data entry and started scaling their practice with AI.
          </p>
          <div className="final-cta__form reveal" data-delay="0.2">
            {ctaSubmitted ? (
              <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-primary)', fontWeight: 600 }}>
                Thank you! We will be in touch shortly.
              </p>
            ) : (
              <>
                <input
                  type="email"
                  placeholder="Enter your firm email"
                  className="final-cta__input"
                  aria-label="Email address"
                  value={ctaEmail}
                  onChange={(e) => setCtaEmail(e.target.value)}
                />
                <Button variant="primary" size="md" onClick={() => { if (ctaEmail) setCtaSubmitted(true); }}>
                  Get Early Access
                </Button>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
