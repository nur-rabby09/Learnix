import { useState, useEffect } from 'react';
import './App.css';
import './StudyBuddy.css';
import Footer from './Footer.jsx';
import Navbar from './Navbar.jsx';
import heroImg from './assets/image001.jpg';
import { API_URL } from './Config.js';

// Shown only to guests (not logged in) as a preview of the feature
const DUMMY_POSTS = [
  {
    _id: 'dummy-1',
    title: 'Need a partner for DSA practice',
    subject: 'Data Structures & Algorithms',
    description: 'Preparing for upcoming lab exam, want to solve problems together twice a week.',
    time: 'Evenings, 6–8 PM',
    place: 'AUST Library, 3rd floor',
    email: 'rabbi.cse@example.com',
    phone: '',
  },
  {
    _id: 'dummy-2',
    title: 'Numerical methods study group',
    subject: 'Numerical Methods',
    description: 'Looking for 2-3 people to go over root finding and interpolation before the quiz.',
    time: 'Sat & Sun, Afternoon',
    place: 'Central Library',
    email: 'nafisa.eee@example.com',
    phone: '',
  },
  {
    _id: 'dummy-3',
    title: 'Assembly language buddy needed',
    subject: 'Assembly Language Programming',
    description: 'Struggling with MASM syntax, want someone to debug programs together.',
    time: 'Weekdays after 5 PM',
    place: 'CSE Building, Room 402',
    email: 'tanvir.cse@example.com',
    phone: '',
  },
];

const EMPTY_FORM = {
  title: '',
  subject: '',
  description: '',
  time: '',
  place: '',
  phone: '',
};

function StudyBuddy() {
  const [searchTerm, setSearchTerm] = useState('');

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  const [guestMessage, setGuestMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isLoggedIn = Boolean(currentUser);

  // Check login state, then load the right set of posts
  useEffect(() => {
    fetch(`${API_URL}/users/profile`, { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setCurrentUser(data);
        setCheckingAuth(false);
        if (data) {
          fetchPosts();
        }
      });
  }, []);

  const fetchPosts = () => {
    setLoadingPosts(true);
    fetch(`${API_URL}/posts`, { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setPosts(data))
      .finally(() => setLoadingPosts(false));
  };

  const handleCreatePost = () => {
    if (!isLoggedIn) {
      setGuestMessage('Please log in to create a post.');
      return;
    }
    setFormError('');
    setFormData(EMPTY_FORM);
    setShowForm(true);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setFormError(data.error || 'Something went wrong');
        setSubmitting(false);
        return;
      }

      setShowForm(false);
      setSubmitting(false);
      fetchPosts();
    } catch {
      setFormError('Something went wrong');
      setSubmitting(false);
    }
  };

  const handleDelete = async (postId) => {
    const response = await fetch(`${API_URL}/posts/${postId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (response.ok) {
      setPosts(posts.filter((post) => post._id !== postId));
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // TODO: filter posts by searchTerm
  };

  const displayedPosts = isLoggedIn ? posts : DUMMY_POSTS;

  return (
    <div>
      <Navbar active="Study buddy" />

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
        <div className="sb-header-actions">
          {guestMessage && <span className="sb-guest-message">{guestMessage}</span>}
          <button className="btn-solid sb-create-btn" onClick={handleCreatePost}>
            + Create Post
          </button>
        </div>
      </div>

      {/* Posts feed */}
      <div className="sb-feed">
        {checkingAuth || loadingPosts ? (
          <p className="sb-status-text">Loading posts...</p>
        ) : displayedPosts.length > 0 ? (
          <div className="sb-grid">
            {displayedPosts.map((post) => (
              <div className="sb-card" key={post._id}>
                <h3 className="sb-card-title">{post.title}</h3>
                {post.subject && <p className="sb-card-subject">{post.subject}</p>}
                <p className="sb-card-desc">{post.description}</p>

                <div className="sb-meta">
                  <span>🕒 {post.time}</span>
                  <span>📍 {post.place}</span>
                </div>

                <div className="sb-contact">
                  <div className="sb-contact-info">
                    <span className="sb-email">✉️ {post.email}</span>
                    {post.phone && <span className="sb-phone">📞 {post.phone}</span>}
                  </div>
                  {isLoggedIn && currentUser && post.createdBy === currentUser._id && (
                    <button
                      className="btn-outline sb-delete-btn"
                      onClick={() => handleDelete(post._id)}
                    >
                      Delete
                    </button>
                  )}
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

      {/* Create post modal */}
      {showForm && (
        <div className="sb-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="sb-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Create a Post</h3>

            {formError && <p className="sb-form-error">{formError}</p>}

            <form onSubmit={handleFormSubmit}>
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                required
              />

              <label>Subject/Topic</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleFormChange}
                required
              />

              <label>Description</label>
              <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleFormChange}
                required
              />

              <label>Time</label>
              <input
                type="text"
                name="time"
                placeholder="e.g. Sunday | 12/12/2025 | , 6–8 PM"
                value={formData.time}
                onChange={handleFormChange}
                required
              />

              <label>Place</label>
              <input
                type="text"
                name="place"
                value={formData.place}
                onChange={handleFormChange}
                required
              />

              <label>Phone number (optional)</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleFormChange}
              />

              <p className="sb-form-note">
                Your email ({currentUser?.email}) will be shared automatically.
              </p>

              <div className="sb-form-actions">
                <button type="button" className="btn-outline" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-solid" disabled={submitting}>
                  {submitting ? 'Posting...' : 'Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default StudyBuddy;