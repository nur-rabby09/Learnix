import { useState, useEffect, useRef } from 'react';
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

  // Poster profile popup
  const [profileView, setProfileView] = useState(null);

  // "Interested students" popup (post owner only)
  const [interestView, setInterestView] = useState(null);

  // Post waiting for the "are you sure?" delete confirmation
  const [deleteTarget, setDeleteTarget] = useState(null);

  const isLoggedIn = Boolean(currentUser);
  const headerRef = useRef(null);

  const fetchPosts = () => {
    setLoadingPosts(true);
    fetch(`${API_URL}/posts`, { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setPosts(data))
      .finally(() => setLoadingPosts(false));
  };

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

  const confirmDelete = async () => {
    await handleDelete(deleteTarget._id);
    setDeleteTarget(null);
  };

  // "Interested" button on someone else's post
  const handleInterest = async (postId) => {
    const response = await fetch(`${API_URL}/posts/${postId}/interest`, {
      method: 'POST',
      credentials: 'include',
    });

    if (response.ok) {
      setPosts(
        posts.map((post) =>
          post._id === postId ? { ...post, myInterest: 'pending' } : post,
        ),
      );
    }
  };

  // Post owner opens the list of interested students
  const handleOpenInterests = async (post) => {
    setInterestView({ postId: post._id, title: post.title, list: [] });

    const response = await fetch(`${API_URL}/posts/${post._id}/interests`, {
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      setInterestView((view) => ({ ...view, list: data }));
    }
  };

  // Post owner accepts or declines one student
  const handleRespond = async (interestId, status) => {
    const response = await fetch(
      `${API_URL}/posts/${interestView.postId}/interests/${interestId}`,
      {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      },
    );

    if (response.ok) {
      setInterestView((view) => ({
        ...view,
        list: view.list.map((item) =>
          item._id === interestId ? { ...item, status } : item,
        ),
      }));
    }
  };

  const handleViewProfile = async (userId) => {
    setProfileView({ loading: true, error: '', user: null });

    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        credentials: 'include',
      });
      const data = await response.json();

      if (!response.ok) {
        setProfileView({ loading: false, error: data.error || 'Could not load profile', user: null });
        return;
      }

      setProfileView({ loading: false, error: '', user: data });
    } catch {
      setProfileView({ loading: false, error: 'Could not load profile', user: null });
    }
  };

  // Results update while typing; pressing Search / Enter just jumps to the results
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (headerRef.current) {
      headerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const displayedPosts = isLoggedIn ? posts : DUMMY_POSTS;

  // Every word typed must appear somewhere in the post
  const keywords = searchTerm.trim().toLowerCase().split(/\s+/).filter(Boolean);

  const filteredPosts = keywords.length
    ? displayedPosts.filter((post) => {
        const text = [
          post.title,
          post.subject,
          post.description,
          post.time,
          post.place,
          post.posterName,
        ]
          .join(' ')
          .toLowerCase();
        return keywords.every((word) => text.includes(word));
      })
    : displayedPosts;

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
      <div className="sb-header" ref={headerRef}>
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
        ) : filteredPosts.length > 0 ? (
          <div className="sb-grid">
            {filteredPosts.map((post) => {
              const isOwner = isLoggedIn && currentUser && post.createdBy === currentUser._id;

              return (
              <div className="sb-card" key={post._id}>
                {post.createdBy && post.posterName && (
                  <div className="sb-poster">
                    <div className="sb-poster-avatar">
                      {post.posterName.charAt(0).toUpperCase()}
                    </div>
                    <span className="sb-poster-name">{post.posterName}</span>
                    <button
                      className="btn-outline sb-view-btn"
                      onClick={() => handleViewProfile(post.createdBy)}
                    >
                      View profile
                    </button>
                  </div>
                )}

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
                  <div className="sb-actions">
                    {isOwner && (
                      <>
                        <button
                          className="btn-solid sb-interest-btn"
                          onClick={() => handleOpenInterests(post)}
                        >
                          Interested ({post.interestCount || 0})
                        </button>
                        <button
                          className="btn-outline sb-delete-btn"
                          onClick={() => setDeleteTarget(post)}
                        >
                          Delete
                        </button>
                      </>
                    )}

                    {isLoggedIn && !isOwner && post.createdBy && !post.myInterest && (
                      <button
                        className="btn-solid sb-interest-btn"
                        onClick={() => handleInterest(post._id)}
                      >
                        I'm interested
                      </button>
                    )}
                    {!isOwner && post.myInterest === 'pending' && (
                      <span className="sb-status sb-status-pending">Interest sent</span>
                    )}
                    {!isOwner && post.myInterest === 'accepted' && (
                      <span className="sb-status sb-status-accepted">Accepted</span>
                    )}
                    {!isOwner && post.myInterest === 'declined' && (
                      <span className="sb-status sb-status-declined">Declined</span>
                    )}
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        ) : displayedPosts.length > 0 ? (
          <div className="sb-empty">
            <p>No posts match "{searchTerm.trim()}".</p>
            <button className="btn-outline" onClick={() => setSearchTerm('')}>
              Clear search
            </button>
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

              <p className="sb-form-note">
                Your email ({currentUser?.email})
                {currentUser?.phone
                  ? ` and phone number (${currentUser.phone}) will be shared automatically.`
                  : ' will be shared automatically. Add a phone number in your profile to share it too.'}
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

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="sb-modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="sb-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete this post?</h3>
            <p className="sb-modal-text">
              Are you sure you want to delete "{deleteTarget.title}"? The post and everyone's
              interest in it will be removed. This can't be undone.
            </p>
            <div className="sb-form-actions">
              <button className="btn-outline" onClick={() => setDeleteTarget(null)}>
                Cancel
              </button>
              <button className="btn-solid sb-confirm-delete-btn" onClick={confirmDelete}>
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interested students modal (post owner) */}
      {interestView && (
        <div className="sb-modal-overlay" onClick={() => setInterestView(null)}>
          <div className="sb-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Interested students</h3>
            <p className="sb-int-post">{interestView.title}</p>

            {interestView.list.length === 0 && (
              <p className="sb-status-text">Nobody has clicked interested yet.</p>
            )}

            {interestView.list.map((item) => (
              <div className="sb-int-item" key={item._id}>
                <div className="sb-int-info">
                  <strong>
                    {item.user.firstName} {item.user.lastName}
                  </strong>
                  <span>
                    {[item.user.department, item.user.university].filter(Boolean).join(', ')}
                  </span>
                </div>

                {item.status === 'pending' ? (
                  <div className="sb-int-actions">
                    <button
                      className="btn-solid sb-view-btn"
                      onClick={() => handleRespond(item._id, 'accepted')}
                    >
                      Accept
                    </button>
                    <button
                      className="btn-outline sb-view-btn"
                      onClick={() => handleRespond(item._id, 'declined')}
                    >
                      Decline
                    </button>
                  </div>
                ) : (
                  <span
                    className={
                      item.status === 'accepted'
                        ? 'sb-status sb-status-accepted'
                        : 'sb-status sb-status-declined'
                    }
                  >
                    {item.status === 'accepted' ? 'Accepted' : 'Declined'}
                  </span>
                )}
              </div>
            ))}

            <div className="sb-form-actions">
              <button className="btn-outline" onClick={() => setInterestView(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Poster profile modal */}
      {profileView && (
        <div className="sb-modal-overlay" onClick={() => setProfileView(null)}>
          <div className="sb-modal" onClick={(e) => e.stopPropagation()}>
            {profileView.loading && <p className="sb-status-text">Loading profile...</p>}

            {profileView.error && <p className="sb-form-error">{profileView.error}</p>}

            {profileView.user && (
              <div className="sb-pf">
                <div className="sb-pf-avatar">
                  {profileView.user.firstName.charAt(0).toUpperCase()}
                  {profileView.user.lastName.charAt(0).toUpperCase()}
                </div>
                <h3 className="sb-pf-name">
                  {profileView.user.firstName} {profileView.user.lastName}
                </h3>

                {profileView.user.bio && (
                  <p className="sb-pf-bio">{profileView.user.bio}</p>
                )}

                <div className="sb-pf-list">
                  <div className="sb-pf-item">
                    <span>University</span>
                    <p>{profileView.user.university || '-'}</p>
                  </div>
                  <div className="sb-pf-item">
                    <span>Department</span>
                    <p>{profileView.user.department || '-'}</p>
                  </div>
                  <div className="sb-pf-item">
                    <span>Starting date</span>
                    <p>{profileView.user.startDate || '-'}</p>
                  </div>
                  <div className="sb-pf-item">
                    <span>Graduation date</span>
                    <p>{profileView.user.graduationDate || '-'}</p>
                  </div>
                  <div className="sb-pf-item">
                    <span>Email</span>
                    <p>{profileView.user.email}</p>
                  </div>
                  <div className="sb-pf-item">
                    <span>Phone</span>
                    <p>{profileView.user.phone || '-'}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="sb-form-actions">
              <button className="btn-outline" onClick={() => setProfileView(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default StudyBuddy;