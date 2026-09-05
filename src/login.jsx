import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { API_URL } from './config.js';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError('');

    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || 'Something went wrong');
      return;
    }

    navigate('/');
  };

  return (
    <div className="login-page">
      <div className="navbar">
        <span className="logo">Learnix</span>
      </div>

      <div className="login-wrapper">
        <h2 className="login-title">Sign In</h2>

      <div className="login-card">
        <p className="eyebrow">Welcome back</p>

          {error && <p className="login-error">{error}</p>}

          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn-solid login-btn" onClick={handleSubmit}>
            Sign in
          </button>

          <p className="signup-text">
            New to Learnix? <a href="/signup">Create an account</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;