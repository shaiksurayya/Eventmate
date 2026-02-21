// import React, { useState, useRef, useEffect } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import { useAuth } from "../Context/AuthContext";
// import { useOwnerAuth } from "../Context/OwnerAuthContext";
// import "./Navbar.css";

// const SmartNavbar = () => {
//   const { isAuthenticated, logout } = useAuth();
//   const { isOwnerAuthenticated, logoutOwner } = useOwnerAuth();
//   const navigate = useNavigate();

//   const [showDropdown, setShowDropdown] = useState(false);
//   const dropdownRef = useRef();

//   const handleLogout = () => {
//     if (isOwnerAuthenticated) {
//       logoutOwner();
//       navigate("/login-owner");
//     } else {
//       logout();
//       navigate("/login");
//     }
//   };

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handler = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setShowDropdown(false);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const role = isOwnerAuthenticated
//     ? "owner"
//     : isAuthenticated
//     ? "user"
//     : "guest";

//   return (
//     <nav className="navbar">
//       <div className="navbar-left">
//         <NavLink to="/" className="logo">
//           EventMate
//         </NavLink>
//       </div>

//       <div className="navbar-right">

//         {/* 👤 USER */}
//         {role === "user" && (
//           <>
//             {/* <NavLink to="/findhall">Find Hall</NavLink>
//             <NavLink to="/bookings">My Bookings</NavLink>
//             <NavLink to="/photographers">Photographers</NavLink>
//             <NavLink to="/planners">Planners</NavLink>
//             <NavLink to="/cakes">Cakes</NavLink>
//             <NavLink to="/attire">Attire</NavLink> */}

//             {/* 👤 Avatar Dropdown */}
//             <button
//             onClick={handleLogout}
//            style={{
//               backgroundColor: "#e63946",
//               color: "#fff",
//              border: "none",
//               padding: "8px 18px",
//               borderRadius: "6px",
//               cursor: "pointer",
//               fontWeight: "500",
//               transition: "0.3s",
//             }}
//             >
//             Logout
//             </button>

//           </>
//         )}

//         {/* 🌍 GUEST */}
//         {role === "guest" && (
//           <>
//             <NavLink to="/about">About</NavLink>
//             <NavLink to="/contact">Contact</NavLink>
//             <NavLink to="/login">Login</NavLink>
//             <NavLink to="/signup">Signup</NavLink>
//           </>
//         )}

//         {/* 🏢 OWNER */}
//         {role === "owner" && (
//           <>
//             <NavLink to="/owner/manage-halls">Manage Halls</NavLink>
//             <NavLink to="/owner/bookings">Bookings</NavLink>
//             <NavLink to="/owner/profile">Profile</NavLink>
//             <NavLink to="/owner/contact-eventmate">Contact</NavLink>
//             <button className="logout-btn" onClick={handleLogout}>
//               Logout
//             </button>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default SmartNavbar;

























// import React, { useState } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import { useAuth } from "../Context/AuthContext";
// import { useOwnerAuth } from "../Context/OwnerAuthContext";
// import "./Navbar.css";

// const SmartNavbar = () => {
//   const { isAuthenticated, logout } = useAuth();
//   const { isOwnerAuthenticated, logoutOwner } = useOwnerAuth();
//   const navigate = useNavigate();

//   const [showModal, setShowModal] = useState(false);
//   const [actionType, setActionType] = useState(""); // login or signup

//   const openModal = (type) => {
//     setActionType(type);
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//   };

//   const handleSelection = (role) => {
//     if (actionType === "login") {
//       navigate(role === "user" ? "/login" : "/login-owner");
//     } else {
//       navigate(role === "user" ? "/signup" : "/signup-owner");
//     }
//     closeModal();
//   };

//   const handleLogout = () => {
//     if (isOwnerAuthenticated) {
//       logoutOwner();
//       navigate("/login-owner");
//     } else {
//       logout();
//       navigate("/login");
//     }
//   };

//   return (
//     <>
//       <nav className="navbar">
//         <div className="navbar-left">
//           <NavLink to="/" className="logo">
//             EventMate
//           </NavLink>
//         </div>

//         <div className="navbar-right">

//           {/*  GUEST */}
//           {!isAuthenticated && !isOwnerAuthenticated && (
//             <>
//               <NavLink to="/about">About</NavLink>
//               <NavLink to="/contact">Contact</NavLink>

//              <span
//            className="nav-item"
//            onClick={() => openModal("login")}
//             >
//             Login
//               </span>

//              <span
//              className="nav-item"
//              onClick={() => openModal("signup")}
//              >
//             Signup
//              </span>

//             </>
//           )}

//           {/* 👤 USER (ONLY LOGOUT) */}
//           {isAuthenticated && !isOwnerAuthenticated && (
//             <button className="logout-btn" onClick={handleLogout}>
//               Logout
//             </button>
//           )}

//           {/* 🏢 OWNER */}
//           {isOwnerAuthenticated && (
//             <>
//               <NavLink to="/owner/manage-halls">
//                 Manage Halls
//               </NavLink>
//               <NavLink to="/owner/bookings">
//                 Bookings
//               </NavLink>
//               <NavLink to="/owner/profile">
//                 Profile
//               </NavLink>

//               <button className="logout-btn" onClick={handleLogout}>
//                 Logout
//               </button>
//             </>
//           )}
//         </div>
//       </nav>

//       {/* 🔥 Modal */}
//       {showModal && (
//         <div className="modal-overlay" onClick={closeModal}>
//           <div
//             className="modal-box"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <h3>
//               {actionType === "login"
//                 ? "Login As"
//                 : "Signup As"}
//             </h3>

//             <button
//               className="modal-btn"
//               onClick={() => handleSelection("user")}
//             >
//               User
//             </button>

//             <button
//               className="modal-btn"
//               onClick={() => handleSelection("owner")}
//             >
//               Owner
//             </button>

//             <button
//               className="close-btn"
//               onClick={closeModal}
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default SmartNavbar;
































import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { useOwnerAuth } from "../Context/OwnerAuthContext";
import "./Navbar.css";

const SmartNavbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const { isOwnerAuthenticated, logoutOwner } = useOwnerAuth();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState("");

  const openModal = (type) => {
    setActionType(type);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleSelection = (role) => {
    if (actionType === "login") {
      navigate(role === "user" ? "/login" : "/login-owner");
    } else {
      navigate(role === "user" ? "/signup" : "/signup-owner");
    }
    closeModal();
  };

  const handleLogout = () => {
    if (isOwnerAuthenticated) {
      logoutOwner();
      navigate("/");
    } else {
      logout();
      navigate("/");
    }
  };

  return (
    <>
      <nav className="navbar">
        <NavLink to="/" className="logo">
          EventMate
        </NavLink>

        <div className="navbar-right">

          {/* GUEST */}
          {!isAuthenticated && !isOwnerAuthenticated && (
            <>
              <NavLink to="/about" className="nav-item">
                About
              </NavLink>

              <NavLink to="/contact" className="nav-item">
                Contact
              </NavLink>

              <span
                className="nav-item"
                onClick={() => openModal("login")}
              >
                Login
              </span>

              <span
                className="nav-item"
                onClick={() => openModal("signup")}
              >
                Signup
              </span>
            </>
          )}

          {/* USER */}
          {isAuthenticated && !isOwnerAuthenticated && (
               <button className="logout-btn1" onClick={handleLogout}>
                Logout
              </button>
          )}

          {/* OWNER */}
          {isOwnerAuthenticated && (
            <>
              {/* <NavLink
                to="/owner/manage-halls"
                className="nav-item"
              >
                Manage Halls
              </NavLink>

              <NavLink
                to="/owner/bookings"
                className="nav-item"
              >
                Bookings
              </NavLink>

              <NavLink
                to="/owner/profile"
                className="nav-item"
              >
                Profile
              </NavLink> */}

              <button className="logout-btn1" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>
              {actionType === "login"
                ? "Login As"
                : "Signup As"}
            </h3>

            <button
              className="modal-btn"
              onClick={() => handleSelection("user")}
            >
              User
            </button>

            <button
              className="modal-btn"
              onClick={() => handleSelection("owner")}
            >
              Owner
            </button>

            <button className="close-btn" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SmartNavbar;
