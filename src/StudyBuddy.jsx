import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import './StudyBuddy.css';
import './Accessories'
import heroImg from './assets/image001.jpg';

const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'Study spaces', path: '/study-spaces' },
  { label: 'Study buddy', path: '/study-buddy' },
  { label: 'Accessories', path: '/accessories'},
];
const DUMMY_POSTS = [
  {
    id: 1,
    title: 'Need a partner for DSA practice',
    description: 'Preparing for upcoming lab exam, want to solve problems together twice a week.',
    time: 'Evenings, 6–8 PM',
    place: 'AUST Library, 3rd floor',
    email: 'rabbi.cse@example.com',
  },
  {
    id: 2,
    title: 'Numerical methods study group',
    description: 'Looking for 2-3 people to go over root finding and interpolation before the quiz.',
    time: 'Sat & Sun, Afternoon',
    place: 'Central Library',
    email: 'nafisa.eee@example.com',
  },
  {
    id: 3,
    title: 'Assembly language buddy needed',
    description: 'Struggling with MASM syntax, want someone to debug programs together.',
    time: 'Weekdays after 5 PM',
    place: 'CSE Building, Room 402',
    email: 'tanvir.cse@example.com',
  },
];

function StudyBuddy() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreatePost = () => {
    // TODO: open create post form/modal
  };

  const handleInterested = () => {
    // TODO: hook up interest action
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // TODO: filter posts by searchTerm
  };

  return (
    <div>

      {/* Top navbar */}
      <div className="navbar">
        <span className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Learnix</span>
        <div className="nav-links">
          {NAV_ITEMS.map((item) => (
            <span
              key={item.label}
              className={item.label === 'Study buddy' ? 'active' : ''}
              onClick={() => item.path && navigate(item.path)}
            >
              {item.label}
            </span>
          ))}
        </div>
        <div className="nav-actions">
          <button className="btn-solid" onClick={() => navigate('/signup')}>Sign up</button>
        </div>
      </div>

      {/* Hero banner with background image and search bar */}
      <div className="sb-hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%), url(${heroImg})` }}>
        <h1>Find your next <span className="sb-highlight">study session</span></h1>
        <p>Search posts by subject, place, or time.</p>
        <form className="sb-search-bar" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search by subject, place..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="btn-solid">Search</button>
        </form>
      </div>

      {/* Page header */}
      <div className="sb-header">
        <div>
          <h1>Study Buddy events</h1>
          <p>Connect with students studying what you're studying.</p>
        </div>
        <button className="btn-solid sb-create-btn" onClick={handleCreatePost}>
          + Create Post
        </button>
      </div>

      {/* Posts feed */}
      <div className="sb-feed">
        {DUMMY_POSTS.length > 0 ? (
          <div className="sb-grid">
            {DUMMY_POSTS.map((post) => (
              <div className="sb-card" key={post.id}>
                <h3 className="sb-card-title">{post.title}</h3>
                <p className="sb-card-desc">{post.description}</p>

                <div className="sb-meta">
                  <span>🕒 {post.time}</span>
                  <span>📍 {post.place}</span>
                </div>

                <div className="sb-contact">
                  <span className="sb-email">✉️ {post.email}</span>
                  <button className="btn-solid sb-interested-btn" onClick={handleInterested}>
                    Interested
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="sb-empty">
            <p>No study posts yet — be the first to create one!</p>
            <button className="btn-solid" onClick={handleCreatePost}>
              + Create Post
            </button>
          </div>
        )}
      </div>

    </div>
  );
}

export default StudyBuddy;