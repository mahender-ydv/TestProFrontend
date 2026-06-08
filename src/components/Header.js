import React from "react";
import { NavLink } from "react-router-dom";

export default function Header() {
  const navItems = [
    { to: "/home", label: "Home" },
    { to: "/exams", label: "Exams" },
    { to: "/feedback", label: "Feedback" },
  ];

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom fixed-top shadow-sm" style={{ height: '70px' }}>

      <div className="container-fluid">
        <NavLink
          className="navbar-brand fw-bold text-dark d-flex align-items-center gap-2"
          to="/home"
        >
          <img
            src="/logo1.png"
            alt="Logo"
            width="50"
            height="50"
            className="d-inline-block align-text-top"
          />
          TestPro
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {navItems.map((item, index) => (
              <li className="nav-item" key={index}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    "nav-link " +
                    (isActive ? "text-primary fw-semibold" : "text-dark")
                  }
                  end
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
