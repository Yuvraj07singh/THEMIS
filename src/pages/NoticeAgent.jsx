import { useState, useEffect, useCallback } from 'react';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import { api } from '../lib/api';
import './Dashboard.css';

const STATUS_LABELS = {
  UPLOADED: { text: 'Uploaded', badge: 'info' },
  EXTRACTED: { text: 'Facts Extracted', badge: 'info' },
  DRAFTED: { text: 'Draft Ready', badge: 'warn' },
  APPROVED: { text: 'Approved', badge: 'safe' },
  EXPORTED: { text: 'Exported', badge: 'safe' },
  FAILED: { text: 'Failed', badge: 'danger' },
};

function fmtMoney(n) {
  if (n == null) return '—';
  return `₹${Number(n).toLocaleString('en-IN')}`;
}

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function NoticeAgent() {
  const [notices, setNotices] = useState([]);
  const [clients, setClients] = useState([]);
  const [selected, setSelected] = useState(null); // full notice with reply
  const [uploadClient, setUploadClient] = useState('');
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [draftText, setDraftText] = useState('');

  const load = useCallback(async () => {
    try {
      const [n, c] = await Promise.all([api.listNotices(), api.listClients()]);
      setNotices(n.notices);
      setClients(c.clients);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNotice = async (id) => {
    setError('');
    try {
      const { notice } = await api.getNotice(id);
      setSelected(notice);
      setDraftText(notice.reply?.draftText || '');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadClient) { setError('Select a client first.'); return; }
    if (!file) { setError('Attach the notice PDF.'); return; }
    setError('');
    setBusy('upload');
    try {
      const { notice } = await api.uploadNotice(uploadClient, file);
      setFile(null);
      await load();
      await openNotice(notice.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  };

  const handleDraft = async () => {
    setBusy('draft');
    setError('');
    try {
      await api.draftReply(selected.id);
      await openNotice(selected.id);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  };

  const handleSaveEdit = async () => {
    setBusy('save');
    setError('');
    try {
      await api.updateReply(selected.id, draftText);
      await openNotice(selected.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  };

  const handleApprove = async () => {
    setBusy('approve');
    setError('');
    try {
      // Save any pending edits first so approval covers exactly what's on screen
      if (draftText !== selected.reply?.draftText) {
        await api.updateReply(selected.id, draftText);
      }
      await api.approveReply(selected.id);
      await openNotice(selected.id);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  };

  const handleExport = async () => {
    setBusy('export');
    setError('');
    try {
      await api.exportReply(selected.id, selected.noticeType);
      await openNotice(selected.id);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  };

  const extraction = selected?.summary ? JSON.parse(selected.summary) : null;
  const citations = selected?.reply?.citationsJson ? JSON.parse(selected.reply.citationsJson) : [];
  const verification = selected?.reply?.verificationJson ? JSON.parse(selected.reply.verificationJson) : null;
  const isApproved = Boolean(selected?.reply?.reviewedAt);
  const hasUnsavedEdits = selected?.reply && draftText !== selected.reply.draftText;

  return (
    <div>
      <div className="app-main__header">
        <h1 className="app-main__greeting">GST Notice Agent</h1>
        <p className="app-main__subtitle">
          Upload a notice. Get a citation-backed draft reply in minutes. You review, approve, and file — you remain the professional of record.
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
              <span className="page-panel__title">New Notice</span>
            </div>
            <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div className="app-field">
                <label htmlFor="notice-client">Client</label>
                <select id="notice-client" className="app-select" value={uploadClient} onChange={(e) => setUploadClient(e.target.value)}>
                  <option value="">Select client…</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}{c.gstin ? ` (${c.gstin})` : ''}</option>
                  ))}
                </select>
              </div>
              {clients.length === 0 && (
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                  No clients yet — add one on the Clients page first.
                </p>
              )}
              <div className="app-field">
                <label htmlFor="notice-file">Notice PDF</label>
                <input
                  id="notice-file"
                  type="file"
                  accept="application/pdf"
                  className="app-input"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </div>
              <Button type="submit" variant="primary" size="sm" disabled={busy === 'upload'}>
                {busy === 'upload' ? 'Reading notice…' : 'Upload & Extract'}
              </Button>
            </form>
          </div>

          <div className="page-panel">
            <div className="page-panel__header">
              <span className="page-panel__title">Notices ({notices.length})</span>
            </div>
            {notices.length === 0 ? (
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>No notices uploaded yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {notices.map((n) => {
                  const st = STATUS_LABELS[n.status] || STATUS_LABELS.UPLOADED;
                  return (
                    <button
                      key={n.id}
                      onClick={() => openNotice(n.id)}
                      style={{
                        textAlign: 'left',
                        padding: 'var(--space-3)',
                        background: selected?.id === n.id ? 'var(--gold-glow)' : 'var(--bg-deep)',
                        border: `1px solid ${selected?.id === n.id ? 'var(--gold-primary)' : 'var(--border-subtle)'}`,
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                          {n.noticeType || 'Notice'}
                        </strong>
                        <StatusBadge status={st.badge}>{st.text}</StatusBadge>
                      </div>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                        {n.client.name} · {fmtDate(n.createdAt)}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: detail */}
        {!selected ? (
          <div className="page-panel" style={{ textAlign: 'center', padding: 'var(--space-16)' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
              Upload a notice or select one from the list to see extracted facts and draft a reply.
            </p>
          </div>
        ) : (
          <div key={selected.id} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {/* Extracted facts */}
            <div className="page-panel">
              <div className="page-panel__header">
                <span className="page-panel__title">Extracted Facts</span>
                <StatusBadge status={(STATUS_LABELS[selected.status] || {}).badge || 'info'}>
                  {(STATUS_LABELS[selected.status] || {}).text || selected.status}
                </StatusBadge>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)' }}>
                <div>
                  <div className="stat-card__label">Notice Type</div>
                  <strong style={{ color: 'var(--text-primary)' }}>{selected.noticeType || '—'}</strong>
                </div>
                <div>
                  <div className="stat-card__label">Section</div>
                  <strong style={{ color: 'var(--text-primary)' }}>{selected.section || '—'}</strong>
                </div>
                <div>
                  <div className="stat-card__label">Demand</div>
                  <strong style={{ color: 'var(--status-danger)' }}>{fmtMoney(selected.demandAmount)}</strong>
                </div>
                <div>
                  <div className="stat-card__label">Reply Due</div>
                  <strong style={{ color: 'var(--status-warn)' }}>{fmtDate(selected.dueDate)}</strong>
                </div>
              </div>
              {extraction?.allegations?.length > 0 && (
                <div style={{ marginTop: 'var(--space-4)' }}>
                  <div className="stat-card__label" style={{ marginBottom: 'var(--space-2)' }}>Allegations Raised</div>
                  <ul style={{ paddingLeft: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                    {extraction.allegations.map((a, i) => (
                      <li key={i} style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{a}</li>
                    ))}
                  </ul>
                </div>
              )}
              {!selected.reply && (
                <div style={{ marginTop: 'var(--space-5)' }}>
                  <Button variant="primary" size="md" onClick={handleDraft} disabled={busy === 'draft'}>
                    {busy === 'draft' ? 'Drafting reply with citations…' : 'Draft Reply'}
                  </Button>
                </div>
              )}
            </div>

            {/* Draft + citations */}
            {selected.reply && (
              <>
                <div className="page-panel">
                  <div className="page-panel__header">
                    <span className="page-panel__title">Draft Reply {isApproved ? '(Approved)' : '(Awaiting your review)'}</span>
                    <Button variant="ghost" size="sm" onClick={handleDraft} disabled={busy === 'draft'}>
                      {busy === 'draft' ? 'Redrafting…' : 'Redraft'}
                    </Button>
                  </div>
                  <textarea
                    value={draftText}
                    onChange={(e) => setDraftText(e.target.value)}
                    rows={18}
                    className="app-input"
                    style={{ width: '100%', fontFamily: 'var(--font-body)', lineHeight: 1.6, resize: 'vertical' }}
                  />
                  <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)', alignItems: 'center', flexWrap: 'wrap' }}>
                    {hasUnsavedEdits && (
                      <Button variant="secondary" size="sm" onClick={handleSaveEdit} disabled={busy === 'save'}>
                        {busy === 'save' ? 'Saving…' : 'Save Edits'}
                      </Button>
                    )}
                    {!isApproved ? (
                      <Button variant="primary" size="sm" onClick={handleApprove} disabled={busy === 'approve'}>
                        {busy === 'approve' ? 'Recording approval…' : 'I have reviewed this draft — Approve'}
                      </Button>
                    ) : (
                      <Button variant="primary" size="sm" onClick={handleExport} disabled={busy === 'export'}>
                        {busy === 'export' ? 'Preparing DOCX…' : 'Export DOCX'}
                      </Button>
                    )}
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                      {isApproved
                        ? `Approved ${fmtDate(selected.reply.reviewedAt)} — export unlocked. Editing re-requires approval.`
                        : 'Export stays locked until you approve. Your approval is recorded in the audit log.'}
                    </span>
                  </div>
                </div>

                <div className="page-panel">
                  <div className="page-panel__header">
                    <span className="page-panel__title">Citations — machine-verified against curated corpus</span>
                    {verification && (
                      <StatusBadge status={verification.clean ? 'safe' : 'warn'}>
                        {verification.verified}/{verification.total} verified
                      </StatusBadge>
                    )}
                  </div>
                  {citations.length === 0 ? (
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>No citations in this draft.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                      {citations.map((c, i) => (
                        <details key={i} style={{ background: 'var(--bg-deep)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)', border: `1px solid ${c.verified ? 'var(--border-subtle)' : 'var(--status-danger)'}` }}>
                          <summary style={{ cursor: 'pointer', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', display: 'flex', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
                            <span><strong>{c.ref || c.sectionRef}</strong>{c.title ? ` — ${c.title}` : ''}</span>
                            <StatusBadge status={c.verified ? 'safe' : 'danger'}>{c.verified ? 'Verified' : 'Failed'}</StatusBadge>
                          </summary>
                          <div style={{ marginTop: 'var(--space-3)' }}>
                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>
                              <em>Supports:</em> {c.point}
                            </p>
                            {c.verified ? (
                              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                                {c.sourceText}
                              </p>
                            ) : (
                              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--status-danger)' }}>
                                {c.reason} — verify this point manually before relying on it.
                              </p>
                            )}
                          </div>
                        </details>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
