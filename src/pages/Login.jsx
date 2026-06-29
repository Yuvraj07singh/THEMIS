import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import AuthBrand from './AuthBrand';
import { useAuth, homePathFor } from '../contexts/AuthContext';
import './Auth.css';

const BRAND_POINTS = [
  { title: 'Citation-verified drafting', desc: 'every statutory reference machine-checked against the source text' },
  { title: 'You stay in control', desc: 'nothing exports without your review and recorded approval' },
  { title: 'Audit-logged', desc: 'every upload, draft, and sign-off is traceable' },
];

function validate(email, password) {
  if (!email.trim()) return 'Email is required.';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email address.';
  if (!password) return 'Password is required.';
  return null;
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate(email, password);
    if (err) { setError(err); return; }
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate(homePathFor(user.role));
    } catch (apiErr) {
      setError(apiErr.message || 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  const handleSocialLogin = () => {
    setError('Social login is coming soon — please use email and password.');
  };

  return (
    <div className="auth">
      <AuthBrand
        title="See why modern legal teams run on THEMIS."
        sub="Purpose-built for India's compliance workflows. Notice replies in minutes, every deadline tracked, every document under your control."
        points={BRAND_POINTS}
      />

      <div className="auth__formside">
        <Link to="/" className="auth__close" aria-label="Close page">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>

        <div className="auth__panel">
          <div className="auth__header">
            <h2>Welcome back</h2>
            <p>Log in to access your workspace.</p>
          </div>

          {error && <p className="auth__error">{error}</p>}

          <form className="auth__form" onSubmit={handleSubmit} noValidate>
            <div className="auth__field">
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="you@company.com"
                autoComplete="email"
                autoFocus
              />
            </div>
            <div className="auth__field">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" variant="primary" size="md" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Logging in...' : 'Log in'}
            </Button>
          </form>

          <div className="auth__divider">
            <span>or continue with</span>
          </div>

          <div className="auth__social">
            <button className="auth__social-btn" type="button" onClick={handleSocialLogin}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button className="auth__social-btn" type="button" onClick={handleSocialLogin}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M15.335 15.335H12.67v-4.177c0-.996-.02-2.278-1.39-2.278-1.39 0-1.601 1.086-1.601 2.207v4.248H7.013V6.75h2.559v1.17h.035c.356-.675 1.227-1.387 2.524-1.387 2.704 0 3.204 1.78 3.204 4.092v4.71zM4.003 5.577a1.546 1.546 0 110-3.092 1.546 1.546 0 010 3.092zM5.336 15.335H2.67V6.75h2.666v8.585zM16.67 0H1.33C.593 0 0 .58 0 1.297v15.406C0 17.42.594 18 1.328 18h15.34c.734 0 1.332-.58 1.332-1.297V1.297C18 .58 17.4 0 16.668 0z" fill="#0A66C2"/>
              </svg>
              LinkedIn
            </button>
          </div>

          <p className="auth__footer">
            Don't have an account?{' '}
            <Link to="/signup" className="auth__link">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
