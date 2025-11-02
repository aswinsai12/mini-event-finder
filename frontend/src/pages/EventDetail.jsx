import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEvent } from '../api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

function SkeletonDetail() {
  return (
    <div className="card" aria-hidden="true">
      <div className="skeleton skel-title" style={{ width: '50%' }}></div>
      <div className="skeleton skel-line" style={{ width: '90%' }}></div>
      <div className="skeleton skel-line" style={{ width: '80%' }}></div>
      <div className="skeleton skel-line" style={{ width: '60%' }}></div>
    </div>
  );
}

export default function EventDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function run() {
      setLoading(true);
      setErr('');
      try {
        const item = await getEvent(id);
        setData(item);
      } catch (e) {
        setErr(e.message || 'Failed to load event');
      } finally {
        setLoading(false);
      }
    }
    run();
  }, [id]);

  if (loading) return <SkeletonDetail />;
  if (err) return <p className="error" role="alert">{err}</p>;
  if (!data) return <p className="error" role="alert">Event not found</p>;

  const pos = [data.location?.lat, data.location?.lng];

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>{data.title}</h2>
      <p style={{ marginTop: 0 }}>{data.description}</p>
      <div className="meta" style={{ marginBottom: 12 }}>
        <span><strong>Location:</strong> {data.location?.name || ''} ({data.location?.lat}, {data.location?.lng})</span>
        <span><strong>Date:</strong> {new Date(data.date).toLocaleString()}</span>
        <span><strong>Participants:</strong> {data.currentParticipants} / {data.maxParticipants}</span>
      </div>

      {Number.isFinite(pos[0]) && Number.isFinite(pos[1]) ? (
        <MapContainer center={pos} zoom={13} style={{ height: 320, width: '100%', borderRadius: 12 }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={pos}><Popup>{data.title}</Popup></Marker>
        </MapContainer>
      ) : null}

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <Link className="btn" to="/">Back to events</Link>
        <a className="btn-ghost" href={`https://www.google.com/maps?q=${data.location?.lat},${data.location?.lng}`} target="_blank" rel="noreferrer">Open in Maps</a>
      </div>
    </div>
  );
}
