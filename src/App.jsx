import { useState } from 'react';
import './App.css';

const NAV_ITEMS = ['Home', 'Study spaces', 'Study buddy', 'Accessories'];

function App() {
  const [activeTab, setActiveTab] = useState('Home');

  return (
    <div>

      {/* Top navbar */}
      <div className="navbar">
        <span className="logo">
          <svg className="logo-icon" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="16" fill="#1f7a1f" />
            <path d="M16 8L27 12.5L16 17L5 12.5L16 8Z" fill="white" />
            <path d="M9 14.5V19.5C9 19.5 12 22 16 22C20 22 23 19.5 23 19.5V14.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="27" y1="12.5" x2="27" y2="18" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Learnix
        </span>
        <div className="nav-links">
          {NAV_ITEMS.map((item) => (
            <span
              key={item}
              className={activeTab === item ? 'active' : ''}
              onClick={() => setActiveTab(item)}
            >
              {item}
            </span>
          ))}
        </div>
        <div className="nav-actions">
          <button className="btn-outline">Get Started</button>
          <button className="btn-solid">Sign up</button>
        </div>
      </div>

      {/* Hero with background photo and quote */}
      <div className="hero">
        <h1>"Where quiet corners meet great company"</h1>
        <p>Quiet corners, open seats, and study partners.</p>
        <div className="search-bar">
          <input type="text" placeholder="Search location" />
          <button className="btn-solid">Search</button>
        </div>
      </div>

      {/* Study spaces */}
      <h2 className="section-title">Study Spaces</h2>
      <div className="row">
        <div className="card">
          <h3>Central Library</h3>
          <p>18 seats open</p>
        </div>
        <div className="card">
          <h3>Brew & Books Cafe</h3>
          <p>6 seats open</p>
        </div>
        <div className="card">
          <h3>Focus Hub</h3>
          <p>11 seats open</p>
        </div>
      </div>

      {/* Study buddy */}
      <h2 className="section-title">Study Buddy</h2>
      <div className="row">
        <div className="card">
          <h3>Sarah K.</h3>
          <p>Studying Calculus II</p>
        </div>
        <div className="card">
          <h3>Rafi H.</h3>
          <p>Studying Data Structures</p>
        </div>
      </div>

      {/* Share accessories */}
      <h2 className="section-title">Share Accessories</h2>
      <div className="row">
        <div className="card">Calculator</div>
        <div className="card">Charger</div>
        <div className="card">Books</div>
      </div>

      {/* Footer */}
      <div className="footer">About Us</div>

    </div>
  );
}

export default App;