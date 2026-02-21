import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useOwnerAuth } from "../Context/OwnerAuthContext"; // Owner Auth Context
import "./Dashboard.css"; // Reuse the same dashboard CSS

const OwnerDashboardLayout = ({ children }) => {
  const { logoutOwner } = useOwnerAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutOwner();
    navigate("/login-owner");
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <h2 className="dashboard-title">Owner Dashboard</h2>
        <ul className="dashboard-menu">
          <li>
            <NavLink
              to="/owner/manage-halls"
              className={({ isActive }) =>
                isActive ? "menu-link active" : "menu-link"
              }
            >
              Add Halls
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/owner/manage-halls-info"
              className={({ isActive }) =>
                isActive ? "menu-link active" : "menu-link"
              }
            >
              Why Add Halls?
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/owner/bookings"
              className={({ isActive }) =>
                isActive ? "menu-link active" : "menu-link"
              }
            >
              Bookings
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/owner/contact-eventmate"
              className={({ isActive }) =>
                isActive ? "menu-link active" : "menu-link"
              }
            >
              Contact Eventmate
            </NavLink>
          </li>
        </ul>

        {/* Optional Logout Button */}
        {/* 
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button> 
        */}
      </aside>

      {/* Main Content */}
      <div className="dashboard-content">{children}</div>
    </div>
  );
};

export default OwnerDashboardLayout;
