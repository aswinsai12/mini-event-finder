import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

let nextId = 1;
const events = [
 // demo event i created (actually it is my interest)
  { id: nextId++, title: 'competative programming', description: 'from newbie to legendary grandmaster(journey of Shreyan Ray(dominater_69))', location: { name: 'Vizag', lat: 17.6868, lng: 83.2185 }, date: '2025-11-05T17:30:00.000Z', maxParticipants: 300, currentParticipants: 200 },
];

// ---- Haversine (km) ----
const toRad = (deg) => (deg * Math.PI) / 180;
function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.asin(Math.sqrt(a));
  return R * c;
}

// ---- Routes ----
app.post('/api/events', (req, res) => {
  const { title, description, location, date, maxParticipants, currentParticipants = 0 } = req.body || {};
  if (!title || !description || !date || !location) {
    return res.status(400).json({ error: 'Missing required fields: title, description, date, location' });
  }
  const lat = Number(location.lat);
  const lng = Number(location.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return res.status(400).json({ error: 'location.lat and location.lng must be valid numbers' });
  }
  const item = {
    id: nextId++,
    title: String(title),
    description: String(description),
    location: { name: String(location.name || ''), lat, lng },
    date: String(date),
    maxParticipants: Number(maxParticipants ?? 0),
    currentParticipants: Number(currentParticipants ?? 0)
  };
  events.push(item);
  res.status(201).json(item);
});

app.get('/api/events', (req, res) => {
  const { q, lat, lng, radiusKm } = req.query;
  let list = [...events];

  if (q) {
    const term = String(q).toLowerCase();
    list = list.filter(e =>
      e.title.toLowerCase().includes(term) ||
      e.description.toLowerCase().includes(term) ||
      (e.location.name || '').toLowerCase().includes(term)
    );
  }

  const hasGeo = lat !== undefined && lng !== undefined && radiusKm !== undefined;
  if (hasGeo) {
    const userLat = Number(lat);
    const userLng = Number(lng);
    const r = Number(radiusKm);
    if (Number.isFinite(userLat) && Number.isFinite(userLng) && Number.isFinite(r) && r >= 0) {
      list = list
        .map(e => ({ ...e, __distanceKm: haversineKm(userLat, userLng, e.location.lat, e.location.lng) }))
        .filter(e => e.__distanceKm <= r)
        .sort((a, b) => a.__distanceKm - b.__distanceKm);
    }
  } else {
    list = list.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  res.json(list);
});

app.get('/api/events/:id', (req, res) => {
  const id = Number(req.params.id);
  const item = events.find(e => e.id === id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

// 404 + error handler
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`API listening on :${PORT}`));
