/** API client — single place for all backend communication, token handling, and errors. */

const TOKEN_KEY = 'themis-token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function request(path, { method = 'GET', body, formData } = {}) {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let payload;
  if (formData) {
    payload = formData; // browser sets multipart boundary
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(`/api${path}`, { method, headers, body: payload });
  } catch {
    throw new ApiError(0, 'Cannot reach the server. Is the backend running?');
  }

  if (res.status === 401) {
    setToken(null);
    // Session expired — let the app's auth state handle redirect
  }

  const contentType = res.headers.get('content-type') || '';
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    if (contentType.includes('application/json')) {
      const data = await res.json().catch(() => ({}));
      message = data.error || message;
    }
    throw new ApiError(res.status, message);
  }

  if (contentType.includes('application/json')) return res.json();
  return res; // binary responses (DOCX downloads)
}

/** Trigger a browser download for a binary endpoint. */
export async function downloadFile(path, filename) {
  const res = await request(path);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export const api = {
  // Auth
  signup: (data) => request('/auth/signup', { method: 'POST', body: data }),
  login: (data) => request('/auth/login', { method: 'POST', body: data }),
  me: () => request('/auth/me'),

  // Clients
  listClients: () => request('/clients'),
  createClient: (data) => request('/clients', { method: 'POST', body: data }),
  updateClient: (id, data) => request(`/clients/${id}`, { method: 'PUT', body: data }),
  deleteClient: (id) => request(`/clients/${id}`, { method: 'DELETE' }),

  // Notices
  listNotices: () => request('/notices'),
  getNotice: (id) => request(`/notices/${id}`),
  uploadNotice: (clientId, file) => {
    const fd = new FormData();
    fd.append('clientId', clientId);
    fd.append('file', file);
    return request('/notices', { method: 'POST', formData: fd });
  },
  draftReply: (id) => request(`/notices/${id}/draft`, { method: 'POST' }),
  updateReply: (id, draftText) => request(`/notices/${id}/reply`, { method: 'PUT', body: { draftText } }),
  approveReply: (id) => request(`/notices/${id}/approve`, { method: 'POST' }),
  exportReply: (id, noticeType) => downloadFile(`/notices/${id}/export`, `reply-${noticeType || 'notice'}.docx`),

  // Deadlines
  listDeadlines: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/deadlines${qs ? `?${qs}` : ''}`);
  },
  setDeadlineStatus: (id, status) => request(`/deadlines/${id}/status`, { method: 'PUT', body: { status } }),

  // Contracts
  getPlaybook: () => request('/contracts/playbook'),
  listContractReviews: () => request('/contracts'),
  getContractReview: (id) => request(`/contracts/${id}`),
  uploadContract: (file) => {
    const fd = new FormData();
    fd.append('file', file);
    return request('/contracts', { method: 'POST', formData: fd });
  },
  approveContractReview: (id) => request(`/contracts/${id}/approve`, { method: 'POST' }),

  // Generated documents
  listDocTypes: () => request('/docs/types'),
  listDocs: () => request('/docs'),
  getDoc: (id) => request(`/docs/${id}`),
  generateDoc: (docType, answers) => request('/docs/generate', { method: 'POST', body: { docType, answers } }),
  finalizeDoc: (id) => request(`/docs/${id}/finalize`, { method: 'POST' }),
  exportDoc: (id, docType) => downloadFile(`/docs/${id}/export`, `${docType.toLowerCase()}.docx`),

  // Dashboard
  dashboardSummary: () => request('/dashboard/summary'),
};
