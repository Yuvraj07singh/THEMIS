import { useState, useEffect, useCallback } from 'react';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import ScoreRing from '../components/ui/ScoreRing';
import { api } from '../lib/api';
import './Dashboard.css';

const SEVERITY_BADGE = { HIGH: 'danger', MEDIUM: 'warn', LOW: 'info' };

export default function ContractReview() {
  const [reviews, setReviews] = useState([]);
  const [playbook, setPlaybook] = useState([]);
  const [selected, setSelected] = useState(null);
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const [r, p] = await Promise.all([api.listContractReviews(), api.getPlaybook()]);
      setReviews(r.reviews);
      setPlaybook(p.playbook);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openReview = async (id) => {
    setError('');
    try {
      const { review } = await api.getContractReview(id);
      setSelected(review);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) { setError('Attach a contract (PDF or .txt).'); return; }
    setError('');
    setBusy('upload');
    try {
      const { review } = await api.uploadContract(file);
      setFile(null);
      await load();
      await openReview(review.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  };

  const handleApprove = async () => {
    setBusy('approve');
    try {
      await api.approveContractReview(selected.id);
      await openReview(selected.id);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  };

  const findings = selected?.findingsJson ? JSON.parse(selected.findingsJson) : [];
  const violations = findings.filter((f) => f.status === 'VIOLATION');
  const unverifiedCount = findings.filter((f) => f.verified === false).length;
  const playbookById = Object.fromEntries(playbook.map((r) => [r.id, r]));

  return (
    <div>
      <div className="app-main__header">
        <h1 className="app-main__greeting">Contract Review</h1>
        <p className="app-main__subtitle">
          Every contract checked against your playbook. Every finding quotes the exact clause — machine-verified against the document, so nothing is invented.
        </p>
      </div>

      {error && (
        <div className="page-panel" style={{ borderColor: 'var(--status-danger)', marginBottom: 'var(--space-4)', padding: 'var(--space-4)' }}>
          <span style={{ color: 'var(--status-danger)', fontSize: 'var(--text-sm)' }}>{error}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 'var(--space-6)', alignItems: 'flex-start' }}>
        {/* Left: upload + list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="page-panel">
            <div className="page-panel__header">
              <span className="page-panel__title">New Review</span>
            </div>
            <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div className="app-field">
                <label htmlFor="contract-file">Contract (PDF or .txt)</label>
                <input
                  id="contract-file"
                  type="file"
                  accept="application/pdf,text/plain"
                  className="app-input"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </div>
              <Button type="submit" variant="primary" size="sm" disabled={busy === 'upload'}>
                {busy === 'upload' ? 'Analyzing against playbook…' : 'Upload & Analyze'}
              </Button>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                Checked against {playbook.length} playbook rules. Analysis takes 30–60 seconds.
              </p>
            </form>
          </div>

          <div className="page-panel">
            <div className="page-panel__header">
              <span className="page-panel__title">Reviews ({reviews.length})</span>
            </div>
            {reviews.length === 0 ? (
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>No contracts reviewed yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {reviews.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => openReview(r.id)}
                    style={{
                      textAlign: 'left',
                      padding: 'var(--space-3)',
                      background: selected?.id === r.id ? 'var(--gold-glow)' : 'var(--bg-deep)',
                      border: `1px solid ${selected?.id === r.id ? 'var(--gold-primary)' : 'var(--border-subtle)'}`,
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      width: '100%',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', gap: 'var(--space-2)' }}>
                      <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {r.document.filename}
                      </strong>
                      <StatusBadge status={r.status === 'APPROVED' ? 'safe' : r.status === 'FAILED' ? 'danger' : r.status === 'ANALYZED' ? 'warn' : 'info'}>
                        {r.status.charAt(0) + r.status.slice(1).toLowerCase()}
                      </StatusBadge>
                    </div>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                      {r.riskScore != null ? `Risk ${r.riskScore}/100 · ` : ''}{new Date(r.createdAt).toLocaleDateString('en-GB')}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: findings */}
        {!selected ? (
          <div className="page-panel" style={{ textAlign: 'center', padding: 'var(--space-16)' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
              Upload a contract or select a review to see playbook findings.
            </p>
          </div>
        ) : (
          <div key={selected.id} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div className="page-panel" style={{ display: 'flex', gap: 'var(--space-8)', alignItems: 'center' }}>
              <ScoreRing score={Math.max(0, 100 - (selected.riskScore ?? 0))} size={120} strokeWidth={8} />
              <div>
                <strong style={{ fontSize: 'var(--text-lg)', color: 'var(--text-primary)', display: 'block', marginBottom: 'var(--space-1)' }}>
                  {selected.document.filename}
                </strong>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
                  {violations.length} playbook violation{violations.length === 1 ? '' : 's'} ·{' '}
                  {findings.filter((f) => f.status === 'SILENT').length} rules unaddressed
                  {unverifiedCount > 0 ? ` · ${unverifiedCount} unverified quote${unverifiedCount === 1 ? '' : 's'}` : ''}
                </p>
                {selected.status === 'ANALYZED' && (
                  <Button variant="primary" size="sm" onClick={handleApprove} disabled={busy === 'approve'}>
                    {busy === 'approve' ? 'Recording…' : 'I have reviewed these findings — Sign Off'}
                  </Button>
                )}
                {selected.status === 'APPROVED' && (
                  <StatusBadge status="safe">Signed off {new Date(selected.approvedAt).toLocaleDateString('en-GB')}</StatusBadge>
                )}
              </div>
            </div>

            <div className="page-panel">
              <div className="page-panel__header">
                <span className="page-panel__title">Findings — quotes machine-verified against the document</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {findings.map((f, i) => {
                  const rule = playbookById[f.ruleId];
                  return (
                    <div key={i} style={{
                      padding: 'var(--space-4)',
                      background: 'var(--bg-deep)',
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid ${f.status === 'VIOLATION' ? 'var(--status-danger)' : 'var(--border-subtle)'}`,
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)', gap: 'var(--space-3)' }}>
                        <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                          {rule?.rule || f.ruleId}
                        </strong>
                        <div style={{ display: 'flex', gap: 'var(--space-2)', flexShrink: 0 }}>
                          {rule && <StatusBadge status={SEVERITY_BADGE[rule.severity] || 'info'}>{rule.severity}</StatusBadge>}
                          <StatusBadge status={f.status === 'COMPLIANT' ? 'safe' : f.status === 'VIOLATION' ? 'danger' : 'info'}>
                            {f.status === 'SILENT' ? 'Not addressed' : f.status.charAt(0) + f.status.slice(1).toLowerCase()}
                          </StatusBadge>
                        </div>
                      </div>
                      {f.clauseQuote && (
                        <blockquote style={{
                          margin: 'var(--space-2) 0',
                          padding: 'var(--space-3)',
                          borderLeft: `3px solid ${f.verified ? 'var(--gold-primary)' : 'var(--status-danger)'}`,
                          background: 'var(--bg-surface)',
                          fontSize: 'var(--text-xs)',
                          color: 'var(--text-secondary)',
                          fontStyle: 'italic',
                        }}>
                          "{f.clauseQuote}"
                          {f.verified === false && (
                            <span style={{ display: 'block', color: 'var(--status-danger)', fontStyle: 'normal', marginTop: 'var(--space-1)' }}>
                              ⚠ {f.warning}
                            </span>
                          )}
                        </blockquote>
                      )}
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>{f.explanation}</p>
                      {f.recommendation && (
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--gold-primary)' }}>
                          → {f.recommendation}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
