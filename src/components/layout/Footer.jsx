import { Link } from 'react-router-dom';
import './Footer.css';

const FOOTER_LINKS = {
  Product: [
    { label: 'Legal Health Score', href: '/signup' },
    { label: 'Document Assembly', href: '/signup' },
    { label: 'Compliance Tracker', href: '/signup' },
    { label: 'Pricing', href: '/#pricing' },
  ],
  Company: [
    { label: 'For Firms', href: '/#firms' },
    { label: 'Features', href: '/#features' },
    { label: 'Get Started', href: '/signup' },
    { label: 'Log In', href: '/login' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/' },
    { label: 'Terms of Service', href: '/' },
    { label: 'Disclaimer', href: '/' },
  ],
};

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <div className="footer__logo">
              <span className="footer__logo-mark">T</span>
              <span className="footer__logo-text">THEMIS</span>
            </div>
            <p className="footer__tagline">
              AI-powered infrastructure for modern law firms.
              Scale your practice with zero hallucination.
            </p>
          </div>

          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category} className="footer__column">
              <h6 className="footer__column-title">{category}</h6>
              <ul className="footer__list">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className="footer__link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            2026 Themis Legal Technologies. All rights reserved.
          </p>
          <p className="footer__disclaimer">
            <strong>Disclaimer:</strong> THEMIS is a technology platform providing software tools for legal professionals. 
            We are a technology company, not a law firm. We do not provide legal advice, opinions, or recommendations. 
            Use of our software does not constitute legal advice or create an attorney-client relationship.
          </p>
        </div>
      </div>
    </footer>
  );
}
