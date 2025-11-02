import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../api';
import MapPicker from '../components/MapPicker';

export default function CreateEvent() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    locationName: '',
    lat: '',
    lng: '',
    date: '',
    maxParticipants: 1
  });
  const [err, setErr] = useState('');
  const [submitting, setSubmitting] = useState(false);
const [dirtyName, setDirtyName] = useState(false);
const set = (k) => (e) => {
  if (k === 'locationName') setDirtyName(true);
  setForm((f) => ({ ...f, [k]: e.target.value }));
};
  function onPick(point) {
    setForm((f) => ({ ...f, lat: point.lat, lng: point.lng }));
  }
  function onAutoName(name) {
    if (!form.locationName) setForm((f) => ({ ...f, locationName: name }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    setSubmitting(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        location: { name: form.locationName.trim(), lat: Number(form.lat), lng: Number(form.lng) },
        date: new Date(form.date).toISOString(),
        maxParticipants: Number(form.maxParticipants || 0)
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
    <form className="card form" onSubmit={onSubmit} noValidate>
      <h2 style={{ marginTop: 0 }}>Create an event</h2>

      <div>
        <label htmlFor="title">Title</label>
        <input id="title" className="input" placeholder="give the damn title" value={form.title} onChange={set('title')} required />
        <p className="helper">Keep it short otherwise there will be consequences</p>
      </div>

      <div>
        <label htmlFor="desc">Description</label>
        <textarea id="desc" className="input" rows={4} placeholder="So whats that boring topic ?" value={form.description} onChange={set('description')} required />
      </div>

      <div>
        <label>Pick location on map</label>
        <MapPicker
          value={form.lat && form.lng ? 
            { 
            lat: Number(form.lat), lng: Number(form.lng) 
          } : null
        }
          onChange={onPick}
          autoName
          onName={onAutoName}
        />
      </div>

      <div className="row">
        <div>
          <label htmlFor="locname">Location name</label>
          <input id="locname" className="input" placeholder="auto-location currently not changing this feature is in demo" value={form.locationName} onChange={set('locationName')} />
        </div>
        <div>
          <label htmlFor="lat">Latitude</label>
          <input id="lat" className="input" type="number" step="any" placeholder="17.6868" value={form.lat} onChange={set('lat')} required />
        </div>
        <div>
          <label htmlFor="lng">Longitude</label>
          <input id="lng" className="input" type="number" step="any" placeholder="83.2185" value={form.lng} onChange={set('lng')} required />
        </div>
      </div>

      <div className="row">
        <div>
          <label htmlFor="date">Date & time</label>
          <input id="date" className="input" type="datetime-local" value={form.date} onChange={set('date')} required />
        </div>
        <div>
          <label htmlFor="max">Max sheeps</label>
          <input id="max" className="input" type="number" min="0" placeholder="e.g., 50" value={form.maxParticipants} onChange={set('maxParticipants')} />
          <p className="helper">Leave empty for no limit.</p>
        </div>
      </div>

      {err && <p className="error" role="alert">{err}</p>}

      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn" type="submit" disabled={submitting}>{submitting ? 'Creating…' : 'Create event'}</button>
        <button className="btn-ghost" type="button" onClick={() => nav(-1)}>Cancel</button>
      </div>
    </form>
  );
}
