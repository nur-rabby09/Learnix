import { useState } from 'react';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    console.log('Sign in:', email, password);
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