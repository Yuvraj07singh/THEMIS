import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Sidebar.css';

const ICONS = {
  overview: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="2" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11" y="2" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="2" y="11" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11" y="11" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  notice: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M5 3h7l4 4v10a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 3v4h4M8 11h4M8 14h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  clients: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 17v-1a5 5 0 015-5h0a5 5 0 015 5v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M13 8a3 3 0 100-4M14 11a5 5 0 014 5v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  calendar: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 8h14M7 2v4M13 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  contract: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M5 3h7l4 4v10a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 3v4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  health: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 6v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  docs: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M6 2h6l4 4v10a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 2v4h4M8 11h6M8 14h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  logout: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M8 17H4a1 1 0 01-1-1V4a1 1 0 011-1h4M13 13l4-3-4-3M17 10H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

const NAV = {
  ca: [
    { label: 'Overview', href: '/ca-dashboard', icon: ICONS.overview },
    { label: 'GST Notices', href: '/ca-dashboard/notices', icon: ICONS.notice },
    { label: 'Clients', href: '/ca-dashboard/clients', icon: ICONS.clients },
    { label: 'Compliance Calendar', href: '/ca-dashboard/compliance', icon: ICONS.calendar },
    { label: 'Health Score', href: '/ca-dashboard/health-score', icon: ICONS.health },
  ],
  lawyer: [
    { label: 'Overview', href: '/law-dashboard', icon: ICONS.overview },
    { label: 'Contract Review', href: '/law-dashboard/contract-review', icon: ICONS.contract },
    { label: 'GST Notices', href: '/law-dashboard/notices', icon: ICONS.notice },
    { label: 'Clients', href: '/law-dashboard/clients', icon: ICONS.clients },
    { label: 'Compliance Calendar', href: '/law-dashboard/compliance', icon: ICONS.calendar },
  ],
  individual: [
    { label: 'My Documents', href: '/my-documents', icon: ICONS.docs },
  ],
};

export default function Sidebar({ role = 'ca' }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const links = NAV[role] || NAV.ca;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
      <div className="sidebar__header">
        <Link to="/" className="sidebar__logo">
          <span className="sidebar__logo-mark">T</span>
          {!collapsed && <span className="sidebar__logo-text">THEMIS</span>}
        </Link>
        <button
          className="sidebar__toggle"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d={collapsed ? 'M6 3l5 5-5 5' : 'M10 3L5 8l5 5'}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <nav className="sidebar__nav">
        <ul className="sidebar__links">
          {links.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className={`sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
                  title={collapsed ? link.label : undefined}
                >
                  <span className="sidebar__link-icon">{link.icon}</span>
                  {!collapsed && (
                    <span className="sidebar__link-label">{link.label}</span>
                  )}
                  {isActive && !collapsed && (
                    <span className="sidebar__link-indicator" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar__footer">
        {!collapsed && user && (
          <div style={{ padding: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user.name}
          </div>
        )}
        <button
          className="sidebar__link"
          onClick={handleLogout}
          style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer' }}
          title={collapsed ? 'Log out' : undefined}
        >
          <span className="sidebar__link-icon">{ICONS.logout}</span>
          {!collapsed && <span className="sidebar__link-label">Log out</span>}
        </button>
      </div>
    </aside>
  );
}
