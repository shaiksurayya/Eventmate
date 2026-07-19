import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AuthForm.css'; // Aapki CSS file

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Show/Hide ke liye state
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    
    const user = { name, email, password };

    try {
      const response = await axios.post(
  'https://eventmate-production-b589.up.railway.app/api/auth/signup',
  user
);
      console.log(response.data);
      alert("Signup successful! Please login to continue.");
      navigate('/login');
    } catch (error) {
      console.error("Signup failed:", error);
      const errorMessage = error.response?.data || "Signup failed! Please try again.";
      alert(errorMessage);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSignup}>
        <h2>User Sign Up</h2>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
        <button type="submit" className="auth-button">Sign Up</button>
        <div className="auth-links">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </form>
    </div>
  );
};

export default Signup;