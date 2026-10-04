import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import { API_URL } from './Config.js';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

function buildForm(user) {
  return {
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    bio: user.bio || '',
    phone: user.phone || '',
    university: user.university || '',
    department: user.department || '',
    startDate: user.startDate || '',
    graduationDate: user.graduationDate || '',
  };
}

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
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

  const handleEdit = () => {
    setForm(buildForm(user));
    setError('');
    setSaved(false);
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setError('');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError('First and last name are required');
      return;
    }

    if (!form.university.trim()) {
      setError('University is required');
      return;
    }

    if (!form.department.trim()) {
      setError('Department is required');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`${API_URL}/users/profile`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Something went wrong');
        setSaving(false);
        return;
      }

      setUser(data);
      setEditing(false);
      setSaved(true);
      setSaving(false);
    } catch {
      setError('Something went wrong');
      setSaving(false);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <div>
      <Navbar active="Profile" />

      <div className="profile-wrapper">
        <h2 className="profile-title">My Account</h2>

        {saved && <p className="profile-success">Profile updated.</p>}

        {!editing ? (
          <div className="profile-card">
            <div className="profile-avatar">
              {user.firstName.charAt(0).toUpperCase()}
              {user.lastName.charAt(0).toUpperCase()}
            </div>

            <div className="profile-row">
              <div className="profile-field">
                <label>First Name</label>
                <p>{user.firstName}</p>
              </div>
              <div className="profile-field">
                <label>Last Name</label>
                <p>{user.lastName}</p>
              </div>
            </div>

            <div className="profile-field">
              <label>Bio</label>
              <p className="profile-bio">{user.bio || '\u00A0'}</p>
            </div>

            <h3 className="profile-section">Student info</h3>

            <div className="profile-row">
              <div className="profile-field">
                <label>Email</label>
                <p>{user.email}</p>
              </div>
              <div className="profile-field">
                <label>Phone</label>
                <p>{user.phone || '\u00A0'}</p>
              </div>
            </div>

            <div className="profile-field">
              <label>
                University<span className="required-star"> *</span>
              </label>
              <p>{user.university || '\u00A0'}</p>
            </div>

            <div className="profile-field">
              <label>
                Department<span className="required-star"> *</span>
              </label>
              <p>{user.department || '\u00A0'}</p>
            </div>

            <div className="profile-row">
              <div className="profile-field">
                <label>Starting date</label>
                <p>{user.startDate || '\u00A0'}</p>
              </div>
              <div className="profile-field">
                <label>Graduation date</label>
                <p>{user.graduationDate || '\u00A0'}</p>
              </div>
            </div>

            <div className="profile-actions">
              <button className="btn-solid profile-btn" onClick={handleEdit}>
                Edit profile
              </button>
              <button className="btn-outline profile-btn" onClick={handleLogout}>
                Log out
              </button>
            </div>
          </div>
        ) : (
          <form className="profile-card" onSubmit={handleSave}>
            {error && <p className="profile-error">{error}</p>}

            <div className="profile-row">
              <div className="profile-field">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="profile-field">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="profile-field">
              <label>Bio</label>
              <textarea
                name="bio"
                rows="4"
                maxLength="300"
                placeholder="Tell other students about yourself..."
                value={form.bio}
                onChange={handleChange}
              />
              <span className="profile-counter">{form.bio.length}/300</span>
            </div>

            <h3 className="profile-section">Student info</h3>

            <div className="profile-row">
              <div className="profile-field">
                <label>Email</label>
                <p className="profile-locked">{user.email}</p>
              </div>
              <div className="profile-field">
                <label>
                  Phone<span className="optional-text"> (optional)</span>
                </label>
                <input
                  type="text"
                  name="phone"
                  placeholder="01XXXXXXXXX"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="profile-field">
              <label>
                University<span className="required-star"> *</span>
              </label>
              <input
                type="text"
                name="university"
                placeholder="e.g. AUST"
                value={form.university}
                onChange={handleChange}
              />
            </div>

            <div className="profile-field">
              <label>
                Department<span className="required-star"> *</span>
              </label>
              <input
                type="text"
                name="department"
                placeholder="e.g. CSE"
                value={form.department}
                onChange={handleChange}
              />
            </div>

            <div className="profile-row">
              <div className="profile-field">
                <label>Starting date</label>
                <input
                  type="text"
                  name="startDate"
                  placeholder="e.g. January 2023"
                  value={form.startDate}
                  onChange={handleChange}
                />
              </div>
              <div className="profile-field">
                <label>
                  Graduation date<span className="optional-text"> (or expected)</span>
                </label>
                <input
                  type="text"
                  name="graduationDate"
                  placeholder="e.g. December 2026"
                  value={form.graduationDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="profile-actions">
              <button type="submit" className="btn-solid profile-btn" disabled={saving}>
                {saving ? 'Saving...' : 'Save changes'}
              </button>
              <button
                type="button"
                className="btn-outline profile-btn"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Profile;