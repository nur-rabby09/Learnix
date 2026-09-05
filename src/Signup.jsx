import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';
import { API_URL } from './config.js';

function SignUp() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || 'Something went wrong');
      return;
    }

    navigate('/');
  };

  return (
    <div className="signup-page">
      <div className="navbar">
        <span className="logo">Learnix</span>
      </div>

      <div className="signup-wrapper">
        <h2 className="signup-title">Sign Up</h2>
        <div className="signup-card">
          <p className="signup-eyebrow">Create Account</p>

          {error && <p className="signup-error">{error}</p>}

          <div className="name-row">
            <div className="name-field">
              <label>First Name</label>
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="name-field">
              <label>Last Name</label>
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>

          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

          <label>Confirm Password</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

          <button className="signup-btn" onClick={handleSubmit}>Sign Up</button>

          <p className="login-text">
            Already Have a Account? <a href="/login">Sign In</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;