import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from './config.js';

const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'Study spaces', path: '/study-spaces' },
  { label: 'Study buddy', path: '/study-buddy' },
  { label: 'Accessories', path: '/accessories' },
];

function Navbar({ active }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/users/profile`, { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setUser(data);
        setChecked(true);
      });
  }, []);

  return (
    <div className="navbar">
      <span className="logo">Learnix</span>
      <div className="nav-links">
        {NAV_ITEMS.map((item) => (
          <span
            key={item.label}
            className={item.label === active ? 'active' : ''}
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </span>
        ))}
      </div>
      <div className="nav-actions">
        {!checked ? null : user ? (
          <span
            className="nav-username"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/profile')}
          >
            Hi, {user.firstName}
          </span>
        ) : (
          <button className="btn-solid" onClick={() => navigate('/signup')}>Sign up</button>
        )}
      </div>
    </div>
  );
}

export default Navbar;