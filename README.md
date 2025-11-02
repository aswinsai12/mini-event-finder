# Mini Event Finder

Discover nearby events, search by topic or proximity, and create your own with a map picker that auto‑fills the location name. A clean, human‑friendly UI, accessible focus states, and helpful loading skeletons make it feel instant and approachable.

## Live Links
- Web (Vercel): https://mini-event-finder-nine.vercel.app
- API (Render): https://mini-event-finder-n2d2.onrender.com

## Key Features
- Fast search with optional distance filter (Haversine) and “Use my location” for quick relevance.
- Create events with a map picker (React‑Leaflet) and automatically reverse-geocode place names.
- Friendly empty states, accessible labels, visible focus rings, and lightweight skeleton loaders.
- Simple, stateless Express API with in‑memory seed data for fast demos and easy review.

## Tech Stack
- Frontend: Vite + React + React Router, React‑Leaflet (Leaflet), vanilla CSS
- Backend: Node.js + Express, CORS enabled
- Mapping: OpenStreetMap tiles + Nominatim reverse geocoding

## Project Structure
mini-event-finder/
├─ backend/ # Express API
│ ├─ index.js
│ ├─ package.json
├─ frontend/ # Vite + React web app
│ ├─ src/
│ │ ├─ pages/ (EventsList, EventDetail, CreateEvent)
│ │ ├─ components/ (MapPicker)
│ │ ├─ api.js, App.jsx, main.jsx, styles.css
│ ├─ vercel.json
└─ README.md

## Quick Start (Local)

### Prerequisites
- Node.js 18+ and npm

### Backend (API)
cd backend
cp .env.example .env # optional: set PORT
npm install
npm start # http://localhost:8080 by default

### Frontend (Web)
cd frontend
cp .env.example .env.local

For local dev, point to your local API:
VITE_API_URL=http://localhost:8080
npm install
npm run dev # Vite dev server (shows URL in terminal)

### Point to your deployed API in production
VITE_API_URL=https://mini-event-finder-n2d2.onrender.com

## API Documentation

Base URL: {API_URL}

- GET /api/events  
  - Query:  
    - q: string (searches title, description, location.name)  
    - lat: number, lng: number, radiusKm: number (optional proximity filtering)  
  - Response: 200 JSON array

- GET /api/events/:id  
  - Response: 200 JSON, or 404 { error }

- POST /api/events  
  - Body JSON:  
    ```
    {
      "title": "string",
      "description": "string",
      "location": { "name": "string", "lat": 0, "lng": 0 },
      "date": "ISO string",
      "maxParticipants": 0
    }
    ```
  - Response: 201 JSON of created event
  - Errors: 400 { error } on validation issues

- DELETE /api/events/:id  
  - Response: 204 No Content, or 404 { error }

### CURL Samples

List
curl https://YOUR_API.onrender.com/api/events

Create
curl -X POST https://YOUR_API.onrender.com/api/events
-H "Content-Type: application/json"
-d [{"id":1,"title":"competative programming","description":"from newbie to legendary grandmaster(journey of Shreyan Ray(dominater_69))","location":{"name":"Vizag","lat":17.6868,"lng":83.2185},"date":"2025-11-05T17:30:00.000Z","maxParticipants":300,"currentParticipants":200}]

Get by id
curl https://YOUR_API.onrender.com/api/events/1

## Deployment

### Backend (Render)
- Service Type: Web Service
- Root Directory: backend
- Build Command: `npm ci` (or `npm install`)
- Start Command: `npm start`
- Node: pin to 20.x in `backend/package.json`:
"engines": { "node": "20.x" }

The server must listen on `process.env.PORT` and host `0.0.0.0`.

### Frontend (Vercel)
- Root: frontend
- Environment Variable: `VITE_API_URL=https://YOUR_API.onrender.com`
- SPA routes: add `frontend/vercel.json`:
{
"rewrites": [
{ "source": "/(.*)", "destination": "/index.html" }
]
}
## UX & Accessibility Notes
- Clear value proposition in the hero, obvious primary actions, and quick‑filter chips for “1‑click” discovery.
- 8‑pt spacing rhythm, AA‑leaning color contrast, and visible `:focus-visible` outlines for keyboard users.
- Non‑blocking geolocation, friendly errors, and skeleton loaders to reduce perceived wait times.

## Challenges & How They Were Solved
- Vite blank screen from incorrect import paths → consolidated all source under `frontend/src` and matched import case/paths exactly.  
- SPA deep‑link 404 after deploy → added `vercel.json` rewrite so all routes serve `index.html`.  
- Leaflet marker icons missing → imported `leaflet/dist/leaflet.css` and wired default marker PNGs in `main.jsx`.  
- Reverse geocoding limits → throttled to ~1 req/sec and showed a subtle “Finding place name…” hint; allowed manual override.  
- Free‑tier cold starts → optional heartbeat to keep the API warm, plus a friendly “warming up…” message on slow first response.

## AI Tools Used
- Assisted in scaffolding, refining Express routes, Vite env wiring, Leaflet setup, deployment configs, and README authoring.  
- All generated code was reviewed and modified for correctness, accessibility, and UX clarity.
- Assisted in writing mapPicker file(becuase i am in learning stage of thar part 😊).

## Roadmap
- Persist data to a real DB (e.g., Postgres) and add auth/ownership for edits.  
- Rate‑limit and caching for geocoding; graceful offline fallback.  
- Filter chips by city/date; pagination or infinite scroll.

## License
MIT
## Aurthor
Aswin(a competitive programming enthusiast) 
