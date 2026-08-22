import { useNavigate } from 'react-router-dom';
import './App.css';

const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'Study spaces', path: '/study-spaces' },
  { label: 'Study buddy', path: '/study-buddy' },
  { label: 'Accessories', path: null },
];

function StudyBuddy() {
  const navigate = useNavigate();

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

      {/* Page content goes here */}

    </div>
  );
}

export default StudyBuddy;