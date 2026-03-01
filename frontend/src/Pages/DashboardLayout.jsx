import React from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import "./Dashboard.css";

const DashboardLayout = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Hide sidebar for specific pages
  const hideSidebar =
    // location.pathname.startsWith("/halls") ||
    location.pathname.startsWith("/hallbookingform") ||
    location.pathname.startsWith("/checkavailabilityform") ||
    location.pathname.startsWith("/booking-suggestions") ||
    location.pathname.startsWith("/successmsg") ||
    location.pathname.startsWith("/recommendationPages") ||
    location.pathname === "/modern" ||
    location.pathname === "/grand" ||
    location.pathname === "/elegant" ||
    location.pathname === "/planning";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      {!hideSidebar && (
        <aside className="dashboard-sidebar">
          <h2 className="dashboard-title">Dashboard</h2>

          <ul className="dashboard-menu">
            <li>
{/* 
               <li>
               <NavLink
              to="/home"
              end
              className={({ isActive }) =>
                isActive ? "menu-link active" : "menu-link"
              }
            >
              Home
            </NavLink>
          </li> */}
                  <li>
              <NavLink
                to="/bookings"
                className={({ isActive }) =>
                  isActive ? "menu-link active" : "menu-link"
                }
              >
                Home
              </NavLink>
            </li>
              <NavLink
                to="/findhall"
                className={({ isActive }) =>
                  isActive ? "menu-link active" : "menu-link"
                }
              >
                Find Hall
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/halls"
                className={({ isActive }) =>
                  isActive ? "menu-link active" : "menu-link"
                }
              >
                Halls by Owners
              </NavLink>
            </li>

          

            <li>
              <NavLink
                to="/photographers"
                className={({ isActive }) =>
                  isActive ? "menu-link active" : "menu-link"
                }
              >
                Photographers
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/planners"
                className={({ isActive }) =>
                  isActive ? "menu-link active" : "menu-link"
                }
              >
                Planners
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/cakes"
                className={({ isActive }) =>
                  isActive ? "menu-link active" : "menu-link"
                }
              >
                Cakes
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/attire"
                className={({ isActive }) =>
                  isActive ? "menu-link active" : "menu-link"
                }
              >
                Attire
              </NavLink>
            </li>
          </ul>

          {/* Optional Logout Button */}
          {/* 
          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button> 
          */}
        </aside>
      )}

      {/* Main Content */}
      <div className="dashboard-content">{children}</div>
    </div>
  );
};

export default DashboardLayout;















