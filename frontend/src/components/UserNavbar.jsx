
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import './Navbar.css';

const UserNavbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout1 = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo">Welcome to EventMate</div>
        
      </div>

      <div className="navbar-right">
        <button className="logout-btn" onClick={handleLogout1}>Logout</button>
      </div>
    </nav>
  );
};

export default UserNavbar;















