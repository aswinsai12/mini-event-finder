export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

async function handle(res) {
  if (!res.ok) {
    const txt = await res.text().catch(() => 'Request failed');
    throw new Error(txt || 'Request failed');
  }
  return res.json();
}

export async function listEvents({ q, lat, lng, radiusKm } = {}) {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (lat != null && lng != null && radiusKm != null) {
    params.set('lat', lat);
    params.set('lng', lng);
    params.set('radiusKm', radiusKm);
  }
  const url = `${API_URL}/api/events${params.toString() ? `?${params}` : ''}`;
  const res = await fetch(url);
  return handle(res);
}

export async function getEvent(id) {
  const res = await fetch(`${API_URL}/api/events/${id}`);
  return handle(res);
}

export async function createEvent(payload) {
  const res = await fetch(`${API_URL}/api/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handle(res);
}
export default listEvents;