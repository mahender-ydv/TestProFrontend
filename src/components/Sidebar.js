import React, { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import {
  FaHome,
  FaChartBar,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";

export default function Sidebar() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        setUsername(parsed.name || "User");
      } catch (error) {
        console.error("Failed to parse user from localStorage");
      }
    }
  }, []);

  const handleLogout = () => {
    const confirmed = window.confirm(
      "Are you sure you want to LogOut your account?"
    );
    if (!confirmed) return;
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.clear();
    navigate("/", { replace: true });
  };

  return (
    <div
      className={`sidebar d-flex flex-column align-items-center p-3 shadow-sm ${
        collapsed ? "sidebar-collapsed" : ""
      }`}
      style={{
        width: collapsed ? "80px" : "250px",
        transition: "width 0.3s",
      }}
    >
      {/* Toggle Button */}
      <button
        className="btn btn-outline-secondary mb-4 align-self-end"
        onClick={() => setCollapsed(!collapsed)}
      >
        <FaBars />
      </button>

      {/* User Info */}
      <div className="sidebar-user d-flex flex-column align-items-center gap-2 mb-4">
        <img
          src="https://imagekit.io/blog/content/images/2019/12/image-optimization.jpg"
          alt="User"
          className="rounded-circle"
          width="60"
          height="60"
        />
        {!collapsed && <h5 className="mb-0 text-center">{username}</h5>}
      </div>

      {/* Nav Items */}
      <ul className="nav nav-pills flex-column w-100 text-center">
        <li className="nav-item mb-3">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              "nav-link d-flex align-items-center gap-2 px-3 py-2 rounded " +
              (isActive ? "bg-primary text-white" : "text-black")
            }
          >
            <FaHome />
            {!collapsed && <span>Online Exams</span>}
          </NavLink>
        </li>

        <li className="nav-item mb-3">
          <NavLink
            to="/analyze"
            className={({ isActive }) =>
              "nav-link d-flex align-items-center gap-2 px-3 py-2 rounded " +
              (isActive ? "bg-primary text-white" : "text-black")
            }
          >
            <FaChartBar />
            {!collapsed && <span>Analysis</span>}
          </NavLink>
        </li>

        <li className="nav-item mb-3">
          <NavLink
            to="/notice"
            className={({ isActive }) =>
              "nav-link d-flex align-items-center gap-2 px-3 py-2 rounded " +
              (isActive ? "bg-primary text-white" : "text-black")
            }
          >
            <FaBell />
            {!collapsed && <span>Notice Board</span>}
          </NavLink>
        </li>

        <li className="nav-item mb-3">
          <NavLink
            to="/setting"
            className={({ isActive }) =>
              "nav-link d-flex align-items-center gap-2 px-3 py-2 rounded " +
              (isActive ? "bg-primary text-white" : "text-black")
            }
          >
            <FaCog />
            {!collapsed && <span>Setting</span>}
          </NavLink>
        </li>

        <li className="nav-item mb-3">
          <button
            className="btn nav-link d-flex align-items-center gap-2 px-3 py-2 rounded text-black w-100"
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            {!collapsed && <span>Logout</span>}
          </button>
        </li>
      </ul>
    </div>
  );
}
