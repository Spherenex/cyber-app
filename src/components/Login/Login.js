import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple credential check - in a real app, this would be an API call
    if (username === 'admin' && password === 'secureSys123') {
      onLogin(username);
    } else {
      setError('Invalid credentials. Access denied.');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>CyberShield</h1>
          <p>Advanced Security Monitoring System</p>
        </div>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          <button type="submit" className="login-button">
            <span>ACCESS SYSTEM</span>
          </button>
        </form>
        <div className="login-footer">
          <p>Authorized Personnel Only</p>
          <p className="small-text">CREDENTIALS: admin / secureSys123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
