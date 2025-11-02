// src/components/MapPicker.jsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

async function reverseGeocode(lat, lng) {
  const url = new URL('https://nominatim.openstreetmap.org/reverse');
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('lat', String(lat));
  url.searchParams.set('lon', String(lng));
  url.searchParams.set('accept-language', 'en');
  const res = await fetch(url.toString(), { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error('Reverse geocoding failed');
  const data = await res.json();
  return data.display_name || '';
}

function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
}

export default function MapPicker({ value, onChange, autoName = true, onName }) {
  const [center, setCenter] = useState(value ?? { lat: 20.5937, lng: 78.9629 });
  const [marker, setMarker] = useState(value ?? null);
  const [loadingName, setLoadingName] = useState(false);
  const throttleRef = useRef(0);

  useEffect(() => {
    if (value) {
      setCenter(value);
      setMarker(value);
    }
  }, [value]);

  async function pick(lat, lng) {
    const point = { lat, lng };
    setMarker(point);
    onChange?.(point);
    if (!autoName || !onName) return;
    const now = Date.now();
    if (now - throttleRef.current < 2500) return; 
    throttleRef.current = now;
    try {
      setLoadingName(true);
      const name = await reverseGeocode(lat, lng);
      onName(name);
    } catch {
    } finally {
      setLoadingName(false);
    }
  }

  function geolocate() {
    if (!('geolocation' in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCenter({ lat, lng });
        pick(lat, lng);
      },
      () => {}
    );
  }

  const mapStyle = useMemo(() => ({ height: 360, width: '100%', borderRadius: 12, overflow: 'hidden' }), []);

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <button type="button" className="btn-secondary" onClick={geolocate}>Use my location</button>
        {loadingName ? <span className="helper">Finding place name…</span> : null}
      </div>
      <MapContainer center={[center.lat, center.lng]} zoom={13} style={mapStyle} scrollWheelZoom={false}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ClickHandler onPick={pick} />
        {marker ? <Marker position={[marker.lat, marker.lng]} /> : null}
      </MapContainer>
      <p className="helper" style={{ marginTop: 8 }}>If you know how to use google map just use this, but this is just demo so it doenst have touchpad zoom-in and zoom-out so just depend on those ("+")&&("-") buttons 🙃</p>
    </div>
  );
}
