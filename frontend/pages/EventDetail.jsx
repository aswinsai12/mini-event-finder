import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEvent } from '../api';

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
        setErr(e.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    }
    run();
  }, [id]);

  if (loading) return <p>Loading…</p>;
  if (err) return <p className="error">{err}</p>;
  if (!data) return <p>Not found</p>;

  return (
    <div className="card">
      <h2>{data.title}</h2>
      <p>{data.description}</p>
      <div className="meta">
        <div><strong>Location:</strong> {data.location?.name || ''} ({data.location?.lat}, {data.location?.lng})</div>
        <div><strong>Date:</strong> {new Date(data.date).toLocaleString()}</div>
        <div><strong>Participants:</strong> {data.currentParticipants} / {data.maxParticipants}</div>
      </div>
      <p><Link className="btn" to="/">Back</Link></p>
    </div>
  );
}
