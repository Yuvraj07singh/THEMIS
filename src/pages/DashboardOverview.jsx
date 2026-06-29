import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import StatusBadge from '../components/ui/StatusBadge';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';
import './Dashboard.css';

const ONBOARDING_STEPS = {
  CA: [
    { label: 'Add your first client', desc: 'Their full statutory calendar (GST, TDS, MCA) is generated automatically.', to: 'clients' },
    { label: 'Upload a GST notice', desc: 'Get a citation-backed draft reply in minutes — you review and approve.', to: 'notices' },
    { label: 'Check the compliance calendar', desc: 'Every deadline for every client, with penalty exposure.', to: 'compliance' },
  ],
  LAWYER: [
    { label: 'Upload a contract for review', desc: 'AI checks it against your playbook with verified clause quotes.', to: 'contract-review' },
    { label: 'Add your first client', desc: 'Track their compliance deadlines automatically.', to: 'clients' },
    { label: 'Try the GST Notice Agent', desc: 'Draft notice replies with machine-verified citations.', to: 'notices' },
  ],
};

function fmtMoney(n) {
  return `₹${Number(n || 0).toLocaleString('en-IN')}`;
}

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function OnboardingBanner({ userName, basePath, steps, onDismiss }) {
  return (
    <div className="onboarding-banner">
      <div className="onboarding-banner__header">
        <div>
          <h3 className="onboarding-banner__title">Welcome to THEMIS, {userName}!</h3>
          <p className="onboarding-banner__subtitle">Three steps to see what your new workspace can do.</p>
        </div>
        <button className="onboarding-banner__dismiss" onClick={onDismiss} aria-label="Dismiss welcome card">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <div className="onboarding-banner__steps">
        {steps.map((step, i) => (
          <div key={i} className="onboarding-step">
            <span className="onboarding-step__num">{i + 1}</span>
            <div>
              <Link to={`${basePath}/${step.to}`} className="onboarding-step__label" style={{ textDecoration: 'none', color: 'var(--text-primary)' }}>
                {step.label}
              </Link>
              <p className="onboarding-step__desc">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="onboarding-banner__actions">
        <Link to={`${basePath}/${steps[0].to}`} className="onboarding-banner__cta">
          Start
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
        <button className="onboarding-banner__skip" onClick={onDismiss}>Skip for now</button>
      </div>
    </div>
  );
}

export default function DashboardOverview() {
  const { user, dismissOnboarding } = useAuth();
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');
  const location = useLocation();
  const basePath = location.pathname.startsWith('/law-dashboard') ? '/law-dashboard' : '/ca-dashboard';
  const userName = user?.name?.split(' ')[0] || 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  useEffect(() => {
    api.dashboardSummary().then(setSummary).catch((err) => setError(err.message));
  }, []);

  const steps = ONBOARDING_STEPS[user?.role] || ONBOARDING_STEPS.CA;
  const radar = summary?.penaltyRadar;

  return (
    <div>
      {user?.isFirstTimeUser && (
        <OnboardingBanner userName={userName} basePath={basePath} steps={steps} onDismiss={dismissOnboarding} />
      )}

      <div className="app-main__header">
        <h1 className="app-main__greeting">{greeting}, {userName}</h1>
        <p className="app-main__subtitle">
          Live overview of your clients, notices, and compliance exposure.
        </p>
      </div>

      {error && (
        <div className="page-panel" style={{ borderColor: 'var(--status-danger)', marginBottom: 'var(--space-4)', padding: 'var(--space-4)' }}>
          <span style={{ color: 'var(--status-danger)', fontSize: 'var(--text-sm)' }}>{error}</span>
        </div>
      )}

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-card__label">Clients</div>
          <div className="stat-card__value">{summary ? summary.clients : <span className="skeleton skeleton--stat" />}</div>
          <span className="stat-card__change">{summary?.clients === 0 ? 'Add your first client' : 'Active roster'}</span>
        </div>
        <div className="stat-card">
          <div className="stat-card__label">Open Notices</div>
          <div className="stat-card__value" style={{ color: summary?.pendingNotices > 0 ? 'var(--status-warn)' : undefined }}>
            {summary ? summary.pendingNotices : <span className="skeleton skeleton--stat" />}
          </div>
          <span className="stat-card__change">{summary?.totalNotices || 0} total processed</span>
        </div>
        <div className="stat-card">
          <div className="stat-card__label">Penalty Exposure (7 days)</div>
          <div className="stat-card__value" style={{ color: radar?.weeklyExposure > 0 ? 'var(--status-danger)' : 'var(--status-safe)' }}>
            {radar ? fmtMoney(radar.weeklyExposure) : <span className="skeleton skeleton--stat" />}
          </div>
          <span className={`stat-card__change ${radar?.overdueCount > 0 ? 'stat-card__change--down' : 'stat-card__change--up'}`}>
            {radar ? `${radar.overdueCount} overdue · ${radar.urgentCount} due this week` : ''}
          </span>
        </div>
        <div className="stat-card">
          <div className="stat-card__label">{user?.role === 'LAWYER' ? 'Contract Reviews' : 'Upcoming Deadlines'}</div>
          <div className="stat-card__value">
            {summary ? (user?.role === 'LAWYER' ? summary.contractReviews : summary.upcomingDeadlines.length) : <span className="skeleton skeleton--stat" />}
          </div>
          <span className="stat-card__change">{user?.role === 'LAWYER' ? 'Analyzed against playbook' : 'Next 5 shown below'}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
        {/* Upcoming Deadlines */}
        <div className="page-panel">
          <div className="page-panel__header">
            <span className="page-panel__title">Upcoming Deadlines</span>
            <Link to={`${basePath}/compliance`} style={{ fontSize: 'var(--text-sm)', color: 'var(--gold-primary)' }}>View All</Link>
          </div>
          {!summary ? (
            <div aria-busy="true"><span className="skeleton skeleton--line" /><span className="skeleton skeleton--line" /><span className="skeleton skeleton--line" /></div>
          ) : summary.upcomingDeadlines.length === 0 ? (
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
              No deadlines yet — add a client and their statutory calendar appears here automatically.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {summary.upcomingDeadlines.map((item) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', display: 'block', marginBottom: '2px' }}>
                      {item.title}
                    </strong>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                      {item.clientName} · {fmtDate(item.dueDate)}
                      {item.penaltyPerDay ? ` · ₹${item.penaltyPerDay}/day if missed` : ''}
                    </span>
                  </div>
                  <StatusBadge status={item.daysLeft <= 7 ? 'warn' : 'safe'}>{item.daysLeft}d left</StatusBadge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Notices */}
        <div className="page-panel">
          <div className="page-panel__header">
            <span className="page-panel__title">Recent Notices</span>
            <Link to={`${basePath}/notices`} style={{ fontSize: 'var(--text-sm)', color: 'var(--gold-primary)' }}>Open Notice Agent</Link>
          </div>
          {!summary ? (
            <div aria-busy="true"><span className="skeleton skeleton--line" /><span className="skeleton skeleton--line" /><span className="skeleton skeleton--line" /></div>
          ) : summary.recentNotices.length === 0 ? (
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
              No notices yet — upload one and get a citation-backed draft reply in minutes.
            </p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Type</th>
                  <th>Demand</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {summary.recentNotices.map((n) => (
                  <tr key={n.id}>
                    <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{n.clientName}</td>
                    <td>{n.noticeType || '—'}</td>
                    <td>{n.demandAmount ? fmtMoney(n.demandAmount) : '—'}</td>
                    <td>
                      <StatusBadge status={n.status === 'EXPORTED' || n.status === 'APPROVED' ? 'safe' : n.status === 'FAILED' ? 'danger' : 'warn'}>
                        {n.status.charAt(0) + n.status.slice(1).toLowerCase()}
                      </StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
