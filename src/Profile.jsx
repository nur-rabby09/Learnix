import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import { API_URL } from './Config.js';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

// Student info fields shown under the name/email section.
// Every one of these starts blank for a new user.
const INFO_FIELDS = [
  { name: 'university', label: 'University', type: 'text', placeholder: 'e.g. AUST', required: true },
  { name: 'department', label: 'Department', type: 'text', placeholder: 'e.g. CSE', required: true },
  { name: 'startDate', label: 'Starting date', type: 'date' },
  { name: 'graduationDate', label: 'Graduation date', type: 'date' },
  { name: 'phone', label: 'Phone', type: 'text', placeholder: '01XXXXXXXXX' },
];

function buildForm(user) {
  return {
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    university: user.university || '',
    department: user.department || '',
    startDate: user.startDate || '',
    graduationDate: user.graduationDate || '',
    phone: user.phone || '',
    bio: user.bio || '',
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

    for (const field of INFO_FIELDS) {
      if (field.required && !form[field.name].trim()) {
        setError(`${field.label} is required`);
        return;
      }
    }

    if (form.startDate && form.graduationDate && form.graduationDate < form.startDate) {
      setError('Graduation date can\'t be before the starting date');
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
              <label>Email</label>
              <p>{user.email}</p>
            </div>

            <h3 className="profile-section">Student info</h3>

            <div className="profile-grid">
              {INFO_FIELDS.map((field) => (
                <div className="profile-field" key={field.name}>
                  <label>
                    {field.label}
                    {field.required && <span className="required-star"> *</span>}
                  </label>
                  <p>{user[field.name] || '\u00A0'}</p>
                </div>
              ))}
            </div>

            <div className="profile-field">
              <label>Bio</label>
              <p className="profile-bio">{user.bio || '\u00A0'}</p>
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
              <label>Email</label>
              <p className="profile-locked">{user.email}</p>
            </div>

            <h3 className="profile-section">Student info</h3>

            <div className="profile-grid">
              {INFO_FIELDS.map((field) => (
                <div className="profile-field" key={field.name}>
                  <label>
                    {field.label}
                    {field.required && <span className="required-star"> *</span>}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={form[field.name]}
                    onChange={handleChange}
                  />
                </div>
              ))}
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