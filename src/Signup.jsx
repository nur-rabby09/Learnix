import { useState } from 'react';
import './SignUp.css';

function SignUp() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = () => {
    console.log('Sign up:', firstName, lastName, email, password, confirmPassword);
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
          <div className="name-row">
            <div className="name-field">
              <label>First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div className="name-field">
              <label>Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

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

          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            className="signup-btn"
            onClick={handleSubmit}
          >
            Sign Up
          </button>

          <p className="login-text">
            Already Have a Account? <a href="/login">Sign In</a>
          </p>

        </div>
      </div>
    </div>
  );
}

export default SignUp;