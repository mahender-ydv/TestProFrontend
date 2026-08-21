import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Camera, Trash2, Settings, ShieldAlert, Sparkles, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import Modal from "./ui/Modal";

export default function Setting() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState(null);
  const fileInputRef = useRef(null);
  const [profilePic, setProfilePic] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = async (e) => {
    const token = localStorage.getItem("token");
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profile", file);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/update-profile-pic`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProfilePic(res.data.imageUrl);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setMessage({ type: "success", text: "Profile picture updated!" });
    } catch (error) {
      console.error(error);
      setMessage({ type: "danger", text: "Failed to update profile picture." });
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setProfilePic(user.profilePic || "https://api.dicebear.com/7.x/avataaars/svg?seed=User");
    }
  }, []);

  const updateName = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/update-profile`,
        { name, email: user.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        localStorage.setItem("user", JSON.stringify({ ...user, name }));
        setMessage({ type: "success", text: "Profile name updated successfully!" });
      } else {
        setMessage({ type: "danger", text: "Failed to update profile name." });
      }
    } catch (err) {
      setMessage({ type: "danger", text: err.response?.data?.message || "Error updating name." });
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      return setMessage({ type: "danger", text: "Please enter both old and new passwords." });
    }
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/change-password`,
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage({ type: "success", text: res.data.message || "Password changed successfully!" });
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setMessage({ type: "danger", text: err.response?.data?.message || "Password change failed." });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${process.env.REACT_APP_API_URL}/auth/delete-account`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("email");
      navigate("/signup");
    } catch (err) {
      alert("Failed to delete account. Please try again.");
    }
  };

  return (
    <div className="container-fluid p-0 animate-fade-in" style={{ maxWidth: "800px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-main mb-1 d-flex align-items-center gap-2">
            Account Settings <Settings size={24} className="text-primary" />
          </h2>
          <p className=" mb-0">Manage your profile, security, and appearance preferences.</p>
        </div>

        <button
          onClick={toggleTheme}
          className="tp-btn tp-btn-secondary px-3 py-2"
        >
          {isDark ? <Sun size={18} className="text-warning" /> : <Moon size={18} className="text-primary" />}
          <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
        </button>
      </div>

      {message && (
        <div className={`tp-badge ${message.type === "success" ? "tp-badge-success" : "tp-badge-danger"} w-100 p-3 mb-4 rounded-3`}>
          <span>{message.text}</span>
        </div>
      )}

      {/* Avatar Header */}
      <div className="glass-card p-4 mb-4 text-center">
        <div className="position-relative d-inline-block mb-3">
          <img
            src={profilePic || "https://api.dicebear.com/7.x/avataaars/svg?seed=User"}
            alt="Profile Avatar"
            className="rounded-circle shadow border border-primary border-3"
            width="110"
            height="110"
            style={{ objectFit: "cover" }}
          />
          <button
            type="button"
            className="tp-btn tp-btn-primary p-2 rounded-circle position-absolute bottom-0 end-0 border-0"
            onClick={handleIconClick}
            title="Update Avatar"
            style={{ width: "36px", height: "36px" }}
          >
            <Camera size={18} />
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            hidden
          />
        </div>

        <h4 className="fw-bold text-main mb-1">{name || "User"}</h4>
        <span className=" fs-6">{email}</span>
      </div>

      {/* Update Profile Name */}
      <div className="glass-card p-4 mb-4">
        <h5 className="fw-bold text-main mb-3">Profile Information</h5>
        <form onSubmit={updateName}>
          <div className="mb-3">
            <label className="form-label fw-semibold text-main">Full Name</label>
            <div className="position-relative">
              <User size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 " />
              <input
                type="text"
                className="tp-input ps-5"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold text-main">Email Address (Read-only)</label>
            <div className="position-relative">
              <Mail size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 " />
              <input
                type="email"
                className="tp-input ps-5 "
                value={email}
                disabled
              />
            </div>
          </div>

          <button type="submit" className="tp-btn tp-btn-primary">
            Save Profile Changes
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="glass-card p-4 mb-4">
        <h5 className="fw-bold text-main mb-3">Security & Password</h5>
        <form onSubmit={changePassword}>
          <div className="mb-3">
            <label className="form-label fw-semibold text-main">Current Password</label>
            <div className="position-relative">
              <Lock size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 " />
              <input
                type="password"
                className="tp-input ps-5"
                placeholder="Enter current password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold text-main">New Password</label>
            <div className="position-relative">
              <Lock size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 " />
              <input
                type="password"
                className="tp-input ps-5"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="tp-btn tp-btn-secondary">
            Change Password
          </button>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="glass-card p-4 border-danger border-opacity-25" style={{ backgroundColor: "rgba(244, 63, 94, 0.05)" }}>
        <h5 className="fw-bold text-danger mb-2">Danger Zone</h5>
        <p className=" fs-6 mb-3">
          Deleting your account will purge all your saved test scores, history, and user settings permanently.
        </p>

        <button
          className="tp-btn tp-btn-danger"
          onClick={() => setShowDeleteModal(true)}
        >
          <Trash2 size={16} /> Delete My Account
        </button>
      </div>

      {/* Delete Account Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account?"
      >
        <p className=" fs-6">
          Are you sure you want to permanently delete your TestPro account? This operation cannot be undone.
        </p>
        <div className="d-flex justify-content-end gap-2 mt-4">
          <button
            className="tp-btn tp-btn-secondary"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </button>
          <button className="tp-btn tp-btn-danger" onClick={handleDeleteAccount}>
            Permanently Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
