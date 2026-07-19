import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';
import './AuthForm.css'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const userCredentials = { email, password };
    
    try {
      const response = await axios.post(
  'https://eventmate-production-b589.up.railway.app/api/auth/login',
  userCredentials
);
    
      const apiToken = response.data.token;
      
      if (apiToken) {
        login(apiToken);
        alert("Login successful!");
        navigate('/bookings'); 
      } else {
        alert("Login failed: Token not received from server.");
      }
    } catch (error) {
        console.error('Login failed:', error);
        const errorMessage = error.response?.data || 'Login failed. An unknown error occurred.';
        alert(errorMessage);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleLogin}>
        <h2>User Login</h2>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '10px', top: '10px', cursor: 'pointer', border: 'none', background: 'transparent', fontSize: '18px' }}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        </div>
        
        <button type="submit" className="auth-button">Login</button>
        
  
   <div className="auth-links-split">
            <h4>Don't have an account?</h4>
            <p><Link to="/signup">Create an account</Link></p>
          </div>
          <div className="forgot-section">
            <p><Link to="/forgot-password">Forgot password?</Link></p>
          </div>

      </form>
    </div>
  );
};

export default Login;