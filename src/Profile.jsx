import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import { API_URL } from './Config.js';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/users/profile`, { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) {
          navigate('/login');
          return;
        }
        setUser(data);
        setLoading(false);
      });
  }, [navigate]);

  const handleLogout = async () => {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    navigate('/');
  };

  if (loading) {
    return null;
  }

  return (
    <div>
      <Navbar active="Profile" />

      <div className="profile-wrapper">
        <h2 className="profile-title">My Account</h2>

        <div className="profile-card">
          <div className="profile-field">
            <label>First Name</label>
            <p>{user.firstName}</p>
          </div>

          <div className="profile-field">
            <label>Last Name</label>
            <p>{user.lastName}</p>
          </div>

          <div className="profile-field">
            <label>Email</label>
            <p>{user.email}</p>
          </div>

          <button className="btn-solid profile-logout-btn" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Profile;