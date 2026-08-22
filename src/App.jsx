import { useNavigate } from 'react-router-dom';
import './App.css';

const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'Study spaces', path: '/study-spaces' },
  { label: 'Study buddy', path: '/study-buddy' },
  { label: 'Accessories', path: null },
];

function App() {
  const navigate = useNavigate();

  return (
    <div>

      {/* Top navbar */}
      <div className="navbar">
        <span className="logo">Learnix</span>
        <div className="nav-links">
          {NAV_ITEMS.map((item) => (
            <span
              key={item.label}
              className={item.label === 'Home' ? 'active' : ''}
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

      {/* Hero with background photo and quote */}
      <div className="hero">
        <h1>"Where quiet corners meet great company"</h1>
        <p>Quiet corners, open seats, and study partners.</p>
      </div>

      {/* About Learnix */}
      <h2 className="section-title">Why Learnix</h2>
      <div className="row">
        <div className="card feature-card">
          <div className="feature-icon">📍</div>
          <h3>Find a seat, fast</h3>
          <p>See real-time seat availability across libraries, cafes, and study hubs near you.</p>
        </div>
        <div className="card feature-card">
          <div className="feature-icon">🤝</div>
          <h3>Study with someone</h3>
          <p>Match with students studying the same subject and stay accountable together.</p>
        </div>
        <div className="card feature-card">
          <div className="feature-icon">🎒</div>
          <h3>Share what you need</h3>
          <p>Borrow or lend chargers, calculators, and books with people nearby.</p>
        </div>
      </div>

      {/* How it works */}
      <h2 className="section-title">How it works</h2>
      <div className="steps">
        <div className="step">
          <div className="step-number">1</div>
          <h3>Search your area</h3>
          <p>Browse study spaces and buddies near you in seconds.</p>
        </div>
        <div className="step">
          <div className="step-number">2</div>
          <h3>Pick your spot</h3>
          <p>Check live seat counts and choose a place that fits.</p>
        </div>
        <div className="step">
          <div className="step-number">3</div>
          <h3>Show up and study</h3>
          <p>Meet your study buddy or grab a seat, no waiting around.</p>
        </div>
      </div>

      {/* CTA banner */}
      <div className="cta-banner">
        <h2>Ready to find your spot?</h2>
        <p>Join Learnix and never waste time hunting for a seat again.</p>
        <button className="btn-solid cta-btn" onClick={() => navigate('/signup')}>Get started</button>
      </div>

      {/* Footer */}
      <div className="footer">About Us</div>

    </div>
  );
}

export default App;