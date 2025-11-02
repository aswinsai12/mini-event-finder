import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listEvents } from '../api';

export default function EventsList() {
  const [q, setQ] = useState('');
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [radiusKm, setRadiusKm] = useState(10);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [data, setData] = useState([]);

  async function load(params = {}) {
    setLoading(true);
    setErr('');
    try {
      const items = await listEvents(params);
      setData(items);
    } catch (e) {
      setErr(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load({ q: '' });
  }, []);

  function useMyLocation() {
    if (!('geolocation' in navigator)) {
      setErr('Geolocation not available');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
      },
      (e) => setErr(e.message || 'Location permission denied')
    );
  }

  function applyFilters() {
    const params = { q };
    if (lat != null && lng != null && radiusKm != null) {
      Object.assign(params, { lat, lng, radiusKm });
    }
    load(params);
  }

  return (
    <div className="card">
      <div className="controls">
        <input
          className="input"
          placeholder="Search title/description/location"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="btn" onClick={applyFilters}>Search</button>
        <button className="btn" onClick={useMyLocation}>Use my location</button>
        <div className="radius">
          <input
            type="range"
            min={1}
            max={50}
            value={radiusKm}
            onChange={(e) => setRadiusKm(Number(e.target.value))}
          />
          <span>{radiusKm} km</span>
        </div>
      </div>

      {loading && <p>Loading…</p>}
      {err && <p className="error">{err}</p>}

      <ul className="list">
        {data.map((e) => (
          <li key={e.id} className="item">
            <div className="row">
              <div className="col">
                <Link className="title" to={`/events/${e.id}`}>{e.title}</Link>
                <div className="meta">
                  <span>{e.location?.name || ''}</span>
                  <span>• {new Date(e.date).toLocaleString()}</span>
                  {'__distanceKm' in e ? <span>• {e.__distanceKm.toFixed(1)} km away</span> : null}
                </div>
              </div>
              <div className="col-right">
                <Link className="btn-outline" to={`/events/${e.id}`}>View</Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
