import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useCountry } from '../../contexts/CountryContext';
import { useAuth, homePathFor } from '../../contexts/AuthContext';
import { COUNTRY_DATA } from '../../data/countryData';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'Features', href: '/#features' },
  { label: 'For Firms', href: '/#firms' },
  { label: 'Pricing', href: '/#pricing' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { countryCode, setCountryCode, country } = useCountry();
  const { user, logout } = useAuth();
  const dashboardPath = homePathFor(user?.role);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close mobile menu on route change */
  useEffect(() => {
    setMobileOpen(false);
    setCountryDropdownOpen(false);
  }, [location.pathname]);

  /* Handle anchor scrolling */
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  /* Prevent body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <nav className="navbar__inner container">
        <Link to="/" className="navbar__logo" aria-label="Themis Home">
          <span className="navbar__logo-mark">T</span>
          <span className="navbar__logo-text">THEMIS</span>
        </Link>

        <ul className="navbar__links">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                to={link.href}
                className={`navbar__link ${
                  location.pathname === link.href ? 'navbar__link--active' : ''
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="navbar__actions">
          <button 
            className="navbar__theme-toggle" 
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          <div className="navbar__country-container">
            <button 
              className="navbar__country-toggle"
              onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
              aria-label="Select Country"
            >
              <span className="navbar__country-flag">{country?.flag}</span>
              <span className="navbar__country-code">{country?.code}</span>
            </button>

            {countryDropdownOpen && (
              <div className="navbar__country-dropdown">
                {Object.values(COUNTRY_DATA).map((c) => (
                  <button
                    key={c.code}
                    className={`navbar__country-option ${c.code === countryCode ? 'navbar__country-option--active' : ''}`}
                    onClick={() => {
                      setCountryCode(c.code);
                      setCountryDropdownOpen(false);
                    }}
                  >
                    <span className="navbar__country-flag">{c.flag}</span>
                    <span className="navbar__country-name">{c.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          {user ? (
            <>
              <Link to={dashboardPath} className="navbar__action-link">Dashboard</Link>
              <button className="navbar__cta" onClick={logout} style={{ background: 'none', border: '1px solid var(--border-default)', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar__action-link">Log in</Link>
              <Link to="/signup" className="navbar__cta">Get Started</Link>
            </>
          )}
        </div>

        <button
          className={`navbar__hamburger ${mobileOpen ? 'navbar__hamburger--open' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile overlay */}
      <div className={`navbar__mobile ${mobileOpen ? 'navbar__mobile--open' : ''}`}>
        <ul className="navbar__mobile-links">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link to={link.href} className="navbar__mobile-link">
                {link.label}
              </Link>
            </li>
          ))}
          <li className="navbar__mobile-divider" />
          <li>
            <Link to="/login" className="navbar__mobile-link">
              Log in
            </Link>
          </li>
          <li>
            <Link to="/signup" className="navbar__mobile-cta">
              Get Started
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
