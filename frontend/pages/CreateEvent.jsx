import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../api';

export default function CreateEvent() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    locationName: '',
    lat: '',
    lng: '',
    date: '',
    maxParticipants: 0
  });
  const [err, setErr] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    setSubmitting(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        location: {
          name: form.locationName.trim(),
          lat: Number(form.lat),
          lng: Number(form.lng)
        },
        date: new Date(form.date).toISOString(),
        maxParticipants: Number(form.maxParticipants)
      };
      const created = await createEvent(payload);
      nav(`/events/${created.id}`);
    } catch (ex) {
      setErr(String(ex.message || 'Create failed'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="card form" onSubmit={onSubmit}>
      <h2>Create Event</h2>
      <input className="input" placeholder="Title" value={form.title} onChange={onChange('title')} required />
      <textarea className="input" placeholder="Description" value={form.description} onChange={onChange('description')} required />
      <input className="input" placeholder="Location name" value={form.locationName} onChange={onChange('locationName')} />
      <div className="row">
        <input className="input" type="number" step="any" placeholder="Latitude" value={form.lat} onChange={onChange('lat')} required />
        <input className="input" type="number" step="any" placeholder="Longitude" value={form.lng} onChange={onChange('lng')} required />
      </div>
      <input className="input" type="datetime-local" value={form.date} onChange={onChange('date')} required />
      <input className="input" type="number" min="0" placeholder="Max participants" value={form.maxParticipants} onChange={onChange('maxParticipants')} />
      {err && <p className="error">{err}</p>}
      <button className="btn" type="submit" disabled={submitting}>{submitting ? 'Creating…' : 'Create'}</button>
    </form>
  );
}
