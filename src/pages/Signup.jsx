import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import AuthBrand from './AuthBrand';
import { useAuth, homePathFor } from '../contexts/AuthContext';
import './Auth.css';

const BRAND_POINTS = [
  { title: 'CA practices', desc: 'GST notice replies in minutes, auto-generated compliance calendars, penalty radar' },
  { title: 'Law firms', desc: 'contract review against your playbook with machine-verified clause quotes' },
  { title: 'Individuals', desc: 'NDAs, founder and employment agreements from guided questions' },
];

function validate({ name, email, password, accountType, firmRole, firmName }) {
  if (!name.trim()) return 'Full name is required.';
  if (!email.trim()) return 'Email is required.';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email address.';
  if (password.length < 8) return 'Password must be at least 8 characters.';
  if (accountType === 'firm') {
    if (!firmRole) return 'Please select CA Firm or Law Firm.';
    if (!firmName.trim()) return 'Firm name is required.';
  }
  return null;
}

export default function Signup() {
  const [accountType, setAccountType] = useState('individual'); // individual | firm
  const [firmRole, setFirmRole] = useState(null); // CA | LAWYER
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [firmName, setFirmName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const clearError = () => setError('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate({ name, email, password, accountType, firmRole, firmName });
    if (err) { setError(err); return; }
    setError('');
    setLoading(true);
    try {
      const role = accountType === 'individual' ? 'INDIVIDUAL' : firmRole;
      const user = await signup({
        name,
        email,
        password,
        role,
        jobTitle: jobTitle.trim() || undefined,
        firmName: accountType === 'firm' ? firmName.trim() : undefined,
      });
      navigate(homePathFor(user.role));
    } catch (apiErr) {
      setError(apiErr.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <AuthBrand
        title="Professional-grade legal tools, working in minutes."
        sub="One workspace for compliance, contracts, and documents — with the professional in control of every output."
        points={BRAND_POINTS}
      />

      <div className="auth__formside">
        <Link to="/" className="auth__close" aria-label="Close page">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>

        <div className="auth__panel auth__panel--wide">
          {/* Account type toggle */}
          <div className="auth__tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={accountType === 'individual'}
              className={`auth__tab ${accountType === 'individual' ? 'auth__tab--active' : ''}`}
              onClick={() => { setAccountType('individual'); clearError(); }}
            >
              Individual
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={accountType === 'firm'}
              className={`auth__tab ${accountType === 'firm' ? 'auth__tab--active' : ''}`}
              onClick={() => { setAccountType('firm'); clearError(); }}
            >
              Firm
            </button>
          </div>

          <div className="auth__header">
            {accountType === 'individual' ? (
              <>
                <h2>Create your account</h2>
                <p>Generate legal documents from guided questions — ready in minutes.</p>
              </>
            ) : (
              <>
                <h2>Set up your firm</h2>
                <p>Notices, compliance calendars, and contract review — tailored to your practice.</p>
              </>
            )}
          </div>

          {error && <p className="auth__error">{error}</p>}

          <form className="auth__form" onSubmit={handleSubmit} noValidate>
            {accountType === 'firm' && (
              <>
                <div className="auth__firmtype">
                  <button
                    type="button"
                    className={`auth__firmtype-btn ${firmRole === 'CA' ? 'auth__firmtype-btn--active' : ''}`}
                    onClick={() => { setFirmRole('CA'); clearError(); }}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12h6M9 16h6M7 4H4a1 1 0 00-1 1v15a1 1 0 001 1h16a1 1 0 001-1V5a1 1 0 00-1-1h-3M9 4a1 1 0 001 1h4a1 1 0 001-1M9 4a1 1 0 011-1h4a1 1 0 011 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>
                      <strong>CA Firm</strong>
                      <small>GST notices, compliance, penalty radar</small>
                    </span>
                  </button>
                  <button
                    type="button"
                    className={`auth__firmtype-btn ${firmRole === 'LAWYER' ? 'auth__firmtype-btn--active' : ''}`}
                    onClick={() => { setFirmRole('LAWYER'); clearError(); }}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path d="M3 6l9-4 9 4M3 6v14l9 4 9-4V6M12 2v20M3 10h18M3 14h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>
                      <strong>Law Firm</strong>
                      <small>Contract review, playbooks, clients</small>
                    </span>
                  </button>
                </div>

                <div className="auth__field">
                  <label htmlFor="signup-firmname">Firm Name *</label>
                  <input
                    id="signup-firmname"
                    type="text"
                    value={firmName}
                    onChange={(e) => { setFirmName(e.target.value); clearError(); }}
                    placeholder={firmRole === 'LAWYER' ? 'e.g. Singh Legal LLP' : 'e.g. Singh & Associates'}
                  />
                </div>
              </>
            )}

            <div className="auth__grid2">
              <div className="auth__field">
                <label htmlFor="signup-name">Full Name *</label>
                <input
                  id="signup-name"
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); clearError(); }}
                  placeholder="Yuvraj Singh"
                  autoComplete="name"
                />
              </div>
              <div className="auth__field">
                <label htmlFor="signup-jobtitle">Job Title{accountType === 'firm' ? ' (e.g. Partner)' : ''}</label>
                <input
                  id="signup-jobtitle"
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder={accountType === 'firm' ? 'Managing Partner' : 'Founder'}
                  autoComplete="organization-title"
                />
              </div>
            </div>

            <div className="auth__grid2">
              <div className="auth__field">
                <label htmlFor="signup-email">{accountType === 'firm' ? 'Work Email *' : 'Email *'}</label>
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearError(); }}
                  placeholder="you@company.com"
                  autoComplete="email"
                />
              </div>
              <div className="auth__field">
                <label htmlFor="signup-password">Password *</label>
                <input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearError(); }}
                  placeholder="Minimum 8 characters"
                  autoComplete="new-password"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" size="md" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Setting up your workspace...' : accountType === 'firm' ? 'Launch Firm Workspace' : 'Create Account'}
            </Button>
          </form>

          <p className="auth__footer">
            Already have an account?{' '}
            <Link to="/login" className="auth__link">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
