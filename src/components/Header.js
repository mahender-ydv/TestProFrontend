import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Sun, Moon, Sparkles, BookOpen, MessageSquare, LogOut, User } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Header() {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedUser = localStorage.getItem("user");
    if (loggedUser) {
      try {
        setUser(JSON.parse(loggedUser));
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  const navItems = [
    { to: "/home", label: "Dashboard", icon: Sparkles },
    { to: "/exams", label: "Exams", icon: BookOpen },
    { to: "/feedback", label: "Feedback", icon: MessageSquare },
  ];

  return (
    <nav
      className="navbar navbar-expand-lg fixed-top glass-panel px-3 px-lg-4"
      style={{ height: "var(--header-height)", zIndex: 1000 }}
    >
      <div className="container-fluid p-0">
        {/* Brand */}
        <NavLink
          className="navbar-brand fw-extrabold d-flex align-items-center gap-2 text-decoration-none"
          to="/home"
        >
          <div
            className="d-flex align-items-center justify-content-center rounded-3 p-2"
            style={{
              background: "linear-gradient(135deg, var(--primary-600), var(--accent-purple))",
              color: "#FFF",
              boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
            }}
          >
            <Sparkles size={20} />
          </div>
          <span className="gradient-text fs-4 fw-bold">TestPro</span>
        </NavLink>

        {/* Mobile toggler */}
        <button
          className="navbar-toggler border-0 text-main"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* Navbar items */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto gap-2 py-2 py-lg-0">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <li className="nav-item" key={index}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `nav-link d-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-semibold transition-all ${
                        isActive
                          ? "bg-primary text-white shadow-sm"
                          : " hover-surface "
                      }`
                    }
                    end
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>

          {/* Right Action Bar */}
          <div className="d-flex align-items-center gap-3 ms-auto pt-2 pt-lg-0">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="tp-btn tp-btn-secondary p-2 rounded-circle border-0 d-flex align-items-center justify-content-center"
              style={{ width: "42px", height: "42px" }}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun size={20} className="text-warning" /> : <Moon size={20} className="text-primary" />}
            </button>

            {/* User Profile Pill */}
            {user ? (
              <NavLink
                to="/setting"
                className="d-flex align-items-center gap-2 px-3 py-1-5 rounded-pill text-decoration-none border border-subtle glass-card"
                style={{ backgroundColor: "var(--bg-surface-elevated)" }}
              >
                <img
                  src={user.profilePic || "https://api.dicebear.com/7.x/avataaars/svg?seed=User"}
                  alt={user.name || "User"}
                  className="rounded-circle"
                  width="32"
                  height="32"
                />
                <span className="fw-semibold text-main fs-6">{user.name?.split(" ")[0] || "User"}</span>
              </NavLink>
            ) : (
              <NavLink to="/login" className="tp-btn tp-btn-primary py-2 px-3 fs-6">
                Sign In
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
