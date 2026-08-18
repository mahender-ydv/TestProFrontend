import React, { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import Modal from "./ui/Modal";

export default function Sidebar() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const loggedUser = localStorage.getItem("user");
    if (loggedUser) {
      try {
        setUser(JSON.parse(loggedUser));
      } catch (error) {
        console.error("Failed to parse user from localStorage");
      }
    }
  }, []);

  const handleConfirmLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.clear();
    setShowLogoutModal(false);
    navigate("/", { replace: true });
  };

  const navItems = [
    { to: "/home", label: "Online Exams", icon: LayoutDashboard },
    { to: "/analyze", label: "Analysis", icon: BarChart3 },
    { to: "/notice", label: "Notice Board", icon: Bell },
    { to: "/setting", label: "Settings", icon: Settings },
  ];

  return (
    <>
      <aside
        className={`sidebar d-flex flex-column p-3 ${
          collapsed ? "sidebar-collapsed" : ""
        }`}
      >
        {/* Toggle Button */}
        <div className="d-flex justify-content-end mb-3">
          <button
            className="tp-btn tp-btn-secondary p-1 border-0 rounded-circle"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* User Card */}
        <div className="d-flex flex-column align-items-center text-center p-3 mb-4 rounded-3 border border-subtle glass-card">
          <img
            src={user?.profilePic || "https://api.dicebear.com/7.x/avataaars/svg?seed=User"}
            alt="User Avatar"
            className="rounded-circle mb-2 border border-primary border-2 p-1"
            width={collapsed ? "44" : "64"}
            height={collapsed ? "44" : "64"}
          />
          {!collapsed && (
            <div className="w-100">
              <h6 className="fw-bold text-main mb-1 text-truncate">
                {user?.name || "Student"}
              </h6>
              <span className="tp-badge tp-badge-primary">
                {user?.role === "admin" ? (
                  <>
                    <ShieldCheck size={12} /> Admin
                  </>
                ) : (
                  <>
                    <UserCheck size={12} /> Student
                  </>
                )}
              </span>
            </div>
          )}
        </div>

        {/* Navigation List */}
        <ul className="nav nav-pills flex-column gap-2 w-100 mb-auto">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <li key={index} className="nav-item">
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `nav-link d-flex align-items-center gap-3 px-3 py-2-5 rounded-3 fw-semibold transition-all ${
                      isActive
                        ? "bg-primary text-white shadow-sm"
                        : "text-muted hover-surface"
                    } ${collapsed ? "justify-content-center px-0" : ""}`
                  }
                >
                  <Icon size={20} />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>

        {/* Logout Button */}
        <div className="pt-3 border-top border-subtle">
          <button
            className={`tp-btn tp-btn-secondary text-danger border-0 w-100 d-flex align-items-center gap-3 ${
              collapsed ? "justify-content-center px-0" : "px-3 py-2-5"
            }`}
            onClick={() => setShowLogoutModal(true)}
          >
            <LogOut size={20} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Confirm Logout"
      >
        <p className="text-muted">
          Are you sure you want to log out of your TestPro account? Any unsaved progress will be cleared.
        </p>
        <div className="d-flex justify-content-end gap-2 mt-4">
          <button
            className="tp-btn tp-btn-secondary"
            onClick={() => setShowLogoutModal(false)}
          >
            Cancel
          </button>
          <button className="tp-btn tp-btn-danger" onClick={handleConfirmLogout}>
            Logout Account
          </button>
        </div>
      </Modal>
    </>
  );
}
