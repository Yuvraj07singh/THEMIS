import { useState, useEffect, useCallback } from 'react';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import './Dashboard.css';

export default function DocumentGenerator() {
  const { user } = useAuth();
  const [types, setTypes] = useState([]);
  const [docs, setDocs] = useState([]);
  const [activeType, setActiveType] = useState(null); // template being filled
  const [answers, setAnswers] = useState({});
  const [viewing, setViewing] = useState(null); // generated doc being previewed
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const [t, d] = await Promise.all([api.listDocTypes(), api.listDocs()]);
      setTypes(t.types);
      setDocs(d.docs);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const startTemplate = (type) => {
    setActiveType(type);
    setViewing(null);
    setAnswers({});
    setError('');
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    for (const q of activeType.questions) {
      if (q.required && !(answers[q.key] || '').trim()) {
        setError(`Please answer: ${q.label}`);
        return;
      }
    }
    setBusy(true);
    setError('');
    try {
      const { doc } = await api.generateDoc(activeType.id, answers);
      setActiveType(null);
      setViewing(doc);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const openDoc = async (id) => {
    setError('');
    setActiveType(null);
    try {
      const { doc } = await api.getDoc(id);
      setViewing(doc);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFinalize = async () => {
    setBusy(true);
    try {
      const { doc } = await api.finalizeDoc(viewing.id);
      setViewing(doc);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleExport = async () => {
    setBusy(true);
    try {
      await api.exportDoc(viewing.id, viewing.docType);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="app-main__header">
        <h1 className="app-main__greeting">Welcome, {user?.name?.split(' ')[0]}</h1>
        <p className="app-main__subtitle">
          Generate legal documents from guided questions. Every document is built from a fixed professional template — review it, finalize it, download it.
        </p>
      </div>

      {error && (
        <div className="page-panel" style={{ borderColor: 'var(--status-danger)', marginBottom: 'var(--space-4)', padding: 'var(--space-4)' }}>
          <span style={{ color: 'var(--status-danger)', fontSize: 'var(--text-sm)' }}>{error}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 'var(--space-6)', alignItems: 'flex-start' }}>
        {/* Left: templates + history */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="page-panel">
            <div className="page-panel__header">
              <span className="page-panel__title">Create New</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {types.map((t) => (
                <button
                  key={t.id}
                  onClick={() => startTemplate(t)}
                  style={{
                    textAlign: 'left',
                    padding: 'var(--space-4)',
                    background: activeType?.id === t.id ? 'var(--gold-glow)' : 'var(--bg-deep)',
                    border: `1px solid ${activeType?.id === t.id ? 'var(--gold-primary)' : 'var(--border-subtle)'}`,
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                  }}
                >
                  <strong style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {t.title}
                  </strong>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    {t.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="page-panel">
            <div className="page-panel__header">
              <span className="page-panel__title">My Documents ({docs.length})</span>
            </div>
            {docs.length === 0 ? (
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>Nothing generated yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {docs.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => openDoc(d.id)}
                    style={{
                      textAlign: 'left',
                      padding: 'var(--space-3)',
                      background: viewing?.id === d.id ? 'var(--gold-glow)' : 'var(--bg-deep)',
                      border: `1px solid ${viewing?.id === d.id ? 'var(--gold-primary)' : 'var(--border-subtle)'}`,
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{d.title}</span>
                    <StatusBadge status={d.status === 'FINAL' ? 'safe' : 'warn'}>{d.status === 'FINAL' ? 'Final' : 'Draft'}</StatusBadge>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: wizard or preview */}
        {activeType ? (
          <div className="page-panel">
            <div className="page-panel__header">
              <span className="page-panel__title">{activeType.title}</span>
            </div>
            <form onSubmit={handleGenerate}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                {activeType.questions.map((q) => (
                  <div className="app-field" key={q.key} style={q.type === 'text' && q.label.length > 40 ? { gridColumn: '1 / -1' } : undefined}>
                    <label htmlFor={`q-${q.key}`}>{q.label}{q.required ? ' *' : ''}</label>
                    {q.type === 'select' ? (
                      <select
                        id={`q-${q.key}`}
                        className="app-select"
                        value={answers[q.key] || ''}
                        onChange={(e) => { setAnswers((a) => ({ ...a, [q.key]: e.target.value })); setError(''); }}
                      >
                        <option value="">Select…</option>
                        {q.options.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input
                        id={`q-${q.key}`}
                        type={q.type === 'date' ? 'date' : 'text'}
                        className="app-input"
                        value={answers[q.key] || ''}
                        onChange={(e) => { setAnswers((a) => ({ ...a, [q.key]: e.target.value })); setError(''); }}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 'var(--space-6)', display: 'flex', gap: 'var(--space-3)' }}>
                <Button type="submit" variant="primary" size="md" disabled={busy}>
                  {busy ? 'Generating…' : 'Generate Document'}
                </Button>
                <Button type="button" variant="ghost" size="md" onClick={() => setActiveType(null)}>Cancel</Button>
              </div>
            </form>
          </div>
        ) : viewing ? (
          <div className="page-panel">
            <div className="page-panel__header">
              <span className="page-panel__title">{viewing.title}</span>
              <StatusBadge status={viewing.status === 'FINAL' ? 'safe' : 'warn'}>
                {viewing.status === 'FINAL' ? 'Finalized' : 'Draft — review required'}
              </StatusBadge>
            </div>
            <pre style={{
              whiteSpace: 'pre-wrap',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-sm)',
              lineHeight: 1.7,
              color: 'var(--text-secondary)',
              background: 'var(--bg-deep)',
              padding: 'var(--space-5)',
              borderRadius: 'var(--radius-md)',
              maxHeight: '60vh',
              overflowY: 'auto',
            }}>
              {viewing.contentText}
            </pre>
            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)', alignItems: 'center', flexWrap: 'wrap' }}>
              {viewing.status !== 'FINAL' ? (
                <Button variant="primary" size="sm" onClick={handleFinalize} disabled={busy}>
                  {busy ? 'Saving…' : 'I have reviewed this — Finalize'}
                </Button>
              ) : (
                <Button variant="primary" size="sm" onClick={handleExport} disabled={busy}>
                  {busy ? 'Preparing…' : 'Download DOCX'}
                </Button>
              )}
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                {viewing.status !== 'FINAL'
                  ? 'Read the document fully before finalizing. Check stamp duty requirements in your state before signing.'
                  : 'This is a template-based draft, not legal advice. Have it reviewed by a professional before execution.'}
              </span>
            </div>
          </div>
        ) : (
          <div className="page-panel" style={{ textAlign: 'center', padding: 'var(--space-16)' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
              Pick a document type on the left to start, or open one of your documents.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
