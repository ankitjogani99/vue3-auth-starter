const BASE = ''; // use proxy, keep paths starting with /api

function authHeaders() {
  const t = localStorage.getItem('access_token');
  return t ? { Authorization: `Bearer ${t}` } : {};
}

async function request(path, { method = 'GET', body, headers = {} } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...headers,
    },
    // REMOVE credentials to avoid extra CORS requirements
    // credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => '');
    throw new Error(`${method} ${path} failed: ${res.status} ${msg}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : {};
}

export const api = {
  registerCarrierOneStep(payload) {
    return request('/api/truckpedia/auth/carrier-one-step-register', {
      method: 'POST',
      body: payload,
    });
  },
  login(payload) {
    return request('/api/auth/login', { method: 'POST', body: payload });
  },
  listDrivers({ page = 1, pageSize = 25, filter = {}, sortBy = {} } = {}) {
    const qs = new URLSearchParams({ page: String(page) }).toString();
    return request(`http://127.0.0.1:8000/api/v2/drivers/get-list?${qs}`, {
      method: 'POST',
      body: { pageSize, filter, sortBy },
    });
  },
  me() {
    return request('/api/auth/me');
  },
};
