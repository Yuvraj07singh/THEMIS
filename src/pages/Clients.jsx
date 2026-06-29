import { useState, useEffect, useCallback } from 'react';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import { api } from '../lib/api';
import './Dashboard.css';

const ENTITY_TYPES = [
  { value: 'PROPRIETORSHIP', label: 'Proprietorship' },
  { value: 'PARTNERSHIP', label: 'Partnership' },
  { value: 'LLP', label: 'LLP' },
  { value: 'PVT_LTD', label: 'Private Limited' },
  { value: 'PUBLIC_LTD', label: 'Public Limited' },
];

const STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
  'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

const EMPTY_FORM = {
  name: '', gstin: '', pan: '', entityType: 'PVT_LTD', state: 'Delhi',
  qrmpOpted: false, hasTds: false, hasPfEsi: false,
};

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = useCallback(async () => {
    try {
      const { clients } = await api.listClients();
      setClients(clients);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const set = (key) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: val }));
    setError('');
  };

  const startEdit = (client) => {
    setEditingId(client.id);
    setForm({
      name: client.name,
      gstin: client.gstin || '',
      pan: client.pan || '',
      entityType: client.entityType,
      state: client.state || 'Delhi',
      qrmpOpted: client.qrmpOpted,
      hasTds: client.hasTds,
      hasPfEsi: client.hasPfEsi,
    });
    setShowForm(true);
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setSuccess('');
    try {
      if (editingId) {
        await api.updateClient(editingId, form);
        setSuccess('Client updated — compliance calendar regenerated.');
      } else {
        const { deadlinesGenerated } = await api.createClient(form);
        setSuccess(`Client added — ${deadlinesGenerated} statutory deadlines auto-generated for the next 12 months.`);
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (client) => {
    if (!window.confirm(`Delete ${client.name}? This removes their notices, deadlines and documents.`)) return;
    try {
      await api.deleteClient(client.id);
      setSuccess('');
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="app-main__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="app-main__greeting">Clients</h1>
          <p className="app-main__subtitle">
            Add a client and their statutory calendar is generated automatically — GST, TDS, MCA, advance tax.
          </p>
        </div>
        <Button variant="primary" size="md" onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(EMPTY_FORM); }}>
          {showForm ? 'Close' : '+ Add Client'}
        </Button>
      </div>

      {error && (
        <div className="page-panel" style={{ borderColor: 'var(--status-danger)', marginBottom: 'var(--space-4)', padding: 'var(--space-4)' }}>
          <span style={{ color: 'var(--status-danger)', fontSize: 'var(--text-sm)' }}>{error}</span>
        </div>
      )}
      {success && (
        <div className="page-panel" style={{ borderColor: 'var(--status-safe)', marginBottom: 'var(--space-4)', padding: 'var(--space-4)' }}>
          <span style={{ color: 'var(--status-safe)', fontSize: 'var(--text-sm)' }}>{success}</span>
        </div>
      )}

      {showForm && (
        <div className="page-panel" style={{ marginBottom: 'var(--space-6)' }}>
          <div className="page-panel__header">
            <span className="page-panel__title">{editingId ? 'Edit Client' : 'New Client'}</span>
          </div>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div className="app-field">
                <label htmlFor="c-name">Client name *</label>
                <input id="c-name" className="app-input" value={form.name} onChange={set('name')} placeholder="e.g. Acme Traders Pvt Ltd" />
              </div>
              <div className="app-field">
                <label htmlFor="c-entity">Entity type *</label>
                <select id="c-entity" className="app-select" value={form.entityType} onChange={set('entityType')}>
                  {ENTITY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div className="app-field">
                <label htmlFor="c-gstin">GSTIN (leave blank if unregistered)</label>
                <input id="c-gstin" className="app-input" value={form.gstin} onChange={set('gstin')} placeholder="07ABCDE1234F1Z5" maxLength={15} style={{ textTransform: 'uppercase' }} />
              </div>
              <div className="app-field">
                <label htmlFor="c-pan">PAN</label>
                <input id="c-pan" className="app-input" value={form.pan} onChange={set('pan')} placeholder="ABCDE1234F" maxLength={10} style={{ textTransform: 'uppercase' }} />
              </div>
              <div className="app-field">
                <label htmlFor="c-state">State</label>
                <select id="c-state" className="app-select" value={form.state} onChange={set('state')}>
                  {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-6)', marginTop: 'var(--space-5)', flexWrap: 'wrap' }}>
              {[
                { key: 'qrmpOpted', label: 'QRMP scheme (quarterly GST filing)' },
                { key: 'hasTds', label: 'Deducts TDS' },
                { key: 'hasPfEsi', label: 'PF / ESI registered' },
              ].map((opt) => (
                <label key={opt.key} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form[opt.key]} onChange={set(opt.key)} />
                  {opt.label}
                </label>
              ))}
            </div>

            <div style={{ marginTop: 'var(--space-6)' }}>
              <Button type="submit" variant="primary" size="md" disabled={busy}>
                {busy ? 'Saving…' : editingId ? 'Update Client & Regenerate Calendar' : 'Add Client & Generate Calendar'}
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="page-panel">
        <div className="page-panel__header">
          <span className="page-panel__title">Client Roster ({clients.length})</span>
        </div>
        {clients.length === 0 ? (
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
            No clients yet. Add your first client to generate their compliance calendar.
          </p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>GSTIN</th>
                <th>Entity</th>
                <th>Filing</th>
                <th>Notices</th>
                <th>Deadlines</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id}>
                  <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{c.name}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{c.gstin || '—'}</td>
                  <td>{ENTITY_TYPES.find((t) => t.value === c.entityType)?.label || c.entityType}</td>
                  <td>
                    {c.gstin
                      ? <StatusBadge status="info">{c.qrmpOpted ? 'QRMP' : 'Monthly'}</StatusBadge>
                      : <span style={{ color: 'var(--text-muted)' }}>No GST</span>}
                  </td>
                  <td>{c._count.notices}</td>
                  <td>{c._count.deadlines}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <Button variant="ghost" size="sm" onClick={() => startEdit(c)}>Edit</Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(c)} style={{ color: 'var(--status-danger)' }}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
