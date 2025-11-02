import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listEvents } from '../api';

function SkeletonList() {
  return (
    <ul className="list" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <li key={i} className="item">
          <div className="skel-title skeleton"></div>
          <div className="skel-line skeleton" style={{ width: '60%' }}></div>
          <div className="skel-line skeleton" style={{ width: '30%' }}></div>
        </li>
      ))}
    </ul>
  );
}

function EmptyState({ onCreate }) {
  return (
    <div className="card" role="status" aria-live="polite">
      <h3 style={{ marginTop: 0 }}>No events match your filters</h3>
      <p className="helper">Try adjusting your search or radius, or add a new event so others nearby can discover it.</p>
      <div style={{ marginTop: 12 }}>
        <Link className="btn" to="/new" onClick={onCreate}>Create an event</Link>
        <span style={{ marginLeft: 8 }} />
        <button className="btn-ghost" onClick={() => window.location.reload()}>Clear filters</button>
      </div>
    </div>
  );
}

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
      setErr(e.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load({}); }, []);

  function useMyLocation() {
    if (!('geolocation' in navigator)) {
      setErr('Location not available in this browser');
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
    if (lat != null && lng != null && radiusKm != null) Object.assign(params, { lat, lng, radiusKm });
    load(params);
  }

  return (
    <div className="grid-2">
      <section className="card">
        <div className="controls" aria-label="Search and filters">
          <div style={{ flex: 2, minWidth: 220 }}>
            <label htmlFor="search">Search events</label>
            <input id="search" className="input" placeholder="Title, description, or location" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div style={{ minWidth: 180 }}>
            <label htmlFor="radius">Radius</label>
            <div className="radius">
              <input id="radius" type="range" min={1} max={50} value={radiusKm} onChange={(e) => setRadiusKm(Number(e.target.value))} />
              <span className="helper">{radiusKm} km</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn" onClick={applyFilters}>Search</button>
            <button className="btn-secondary" type="button" onClick={useMyLocation}>Use my location</button>
          </div>
        </div>

        {err && <p className="error" role="alert">{err}</p>}
        {loading ? (
          <SkeletonList />
        ) : data.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="list">
            {data.map((e) => (
              <li key={e.id} className="item">
                <div className="row-line">
                  <div>
                    <Link className="title" to={`/events/${e.id}`}>{e.title}</Link>
                    <div className="meta">
                      <span>{e.location?.name || ''}</span>
                      <span>{new Date(e.date).toLocaleString()}</span>
                      {'__distanceKm' in e ? <span>{e.__distanceKm.toFixed(1)} km away</span> : null}
                    </div>
                  </div>
                  <div>
                    <Link className="btn-secondary" to={`/events/${e.id}`}>View</Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <aside className="card">
        <h3 style={{ marginTop: 0 }}>Tips</h3>
        <ul style={{ paddingLeft: 18, margin: 0 }}>
          <li className="helper">There will be no tips just explore it yourself</li>
        </ul>
        <div style={{ marginTop: 12 }}>
          <Link className="btn" to="/new">Create an event</Link>
        </div>
      </aside>
    </div>
  );
}
