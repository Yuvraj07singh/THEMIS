import { Link } from 'react-router-dom';

const CHECK = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 8.5l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Left editorial panel shared by Login and Signup — Harvey-style split layout. */
export default function AuthBrand({ title, sub, points }) {
  return (
    <div className="auth__brand">
      <Link to="/" className="auth__brand-logo">
        <span className="auth__logo-mark">T</span>
        <span className="auth__logo-text">THEMIS</span>
      </Link>

      <div className="auth__brand-main">
        <h1 className="auth__brand-title">{title}</h1>
        <p className="auth__brand-sub">{sub}</p>
        <ul className="auth__brand-points">
          {points.map((p, i) => (
            <li key={i} className="auth__brand-point">
              {CHECK}
              <span><strong>{p.title}</strong> — {p.desc}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="auth__brand-footer">
        <Link to="/">Back to website</Link>
        <span style={{ margin: '0 8px' }}>·</span>
        © 2026 Themis Legal Technologies. We are a technology platform, not a law firm.
      </div>
    </div>
  );
}
