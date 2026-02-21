// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useOwnerAuth } from '../Context/OwnerAuthContext';

// const OwnerNavbar = () => {
//   const { logoutOwner } = useOwnerAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logoutOwner();
//     navigate('/login-owner');
//   };

//   const navbarStyles = {
//     backgroundColor: '#080808',/*2c2c2c*/
//     color: '#fff',
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: '15px 40px',
//     boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
//     position: 'relative',
//     top: 0,
//     zIndex: 1000,
//   };

//   const logoStyles = {
//     fontSize: '24px',
//     fontWeight: 'bold',
//     color: '#fff',
//     textDecoration: 'none',
//     letterSpacing: '1px',
//   };

//   const navLinksStyles = {
//     display: 'flex',
//     gap: '25px',
//     alignItems: 'center',
//   };

//   const linkStyles = {
//     color: '#f0f0f0',
//     textDecoration: 'none',
//     fontSize: '16px',
//     transition: 'color 0.3s ease',
//   };

//   const linkHover = {
//     color: '#f2c94c', // golden hover effect
//   };

//   const buttonStyles = {
//     backgroundColor: '#ce322cff',
//     color: 'white',
//     border: 'none',
//     padding: '8px 16px',
//     borderRadius: '5px',
//     cursor: 'pointer',
//     fontWeight: 'bold',
//     transition: 'background-color 0.3s ease',
//   };

//   const buttonHover = {
//     backgroundColor: '#d9534f',
//   };

//   return (
//     <nav style={navbarStyles}>
//       <Link to="/owner-dashboard" style={logoStyles}>
//         EventMate Owner
//       </Link>

//       <div style={navLinksStyles}>
      
//         <button 
//           style={buttonStyles}
//           onMouseOver={e => e.target.style.backgroundColor = buttonHover.backgroundColor}
//           onMouseOut={e => e.target.style.backgroundColor = buttonStyles.backgroundColor}
//           onClick={handleLogout}
//         >
//           Logout
//         </button>
//       </div>
//     </nav>
//   );
// };

// export default OwnerNavbar;



































import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useOwnerAuth } from "../Context/OwnerAuthContext";
import "./Navbar.css";

const OwnerNavbar = () => {
  const { logoutOwner } = useOwnerAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutOwner();
    navigate("/login-owner");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <NavLink to="/owner/manage-halls" className="logo">
          EventMate Owner
        </NavLink>
      </div>

      <div className="navbar-right">
        <NavLink to="/owner/manage-halls">Manage Halls</NavLink>
        <NavLink to="/owner/bookings">Bookings</NavLink>
        <NavLink to="/owner/profile">Profile</NavLink>
        <NavLink to="/owner/contact-eventmate">Contact</NavLink>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default OwnerNavbar;
