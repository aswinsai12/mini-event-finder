import { Routes, Route, Link } from 'react-router-dom';
import EventsList from './pages/EventsList.jsx';
import EventDetail from './pages/EventDetail.jsx';
import CreateEvent from './pages/CreateEvent.jsx';

export default function App() {
  return (
    <div className="container">
      <header className="topbar">
        <h1 className="logo"><Link to="/">Mini Event Finder</Link></h1>
        <nav className="nav">
          <Link to="/">Events</Link>
          <Link to="/new">Create</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<EventsList />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/new" element={<CreateEvent />} />
        </Routes>
      </main>
    </div>
  );
}
