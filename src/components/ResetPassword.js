import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Lock, Sparkles, ArrowRight, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      setIsError(true);
      return;
    }

    setIsLoading(true);
    setIsError(false);
    setMessage("");

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/reset-password/${token}`,
        { password: newPassword }
      );

      setMessage(res.data.message || "Password successfully reset!");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setIsError(true);
      console.error("Full error:", err);
      setMessage(
        err.response?.data?.message ||
          err.message ||
          "Failed to reset password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex flex-column justify-content-center align-items-center p-3 position-relative"
      style={{ backgroundColor: "var(--bg-app)" }}
    >
      <div className="position-absolute top-0 end-0 p-4">
        <button
          onClick={toggleTheme}
          className="tp-btn tp-btn-secondary p-2 rounded-circle border-0"
          style={{ width: "42px", height: "42px" }}
          title="Toggle theme"
        >
          {isDark ? <Sun size={20} className="text-warning" /> : <Moon size={20} className="text-primary" />}
        </button>
      </div>

      <div
        className="glass-card w-100 p-4 p-md-5 animate-fade-in text-center"
        style={{ maxWidth: "440px" }}
      >
        <div
          className="d-inline-flex align-items-center justify-content-center rounded-3 p-3 mb-3"
          style={{
            background: "linear-gradient(135deg, var(--primary-600), var(--accent-purple))",
            color: "#FFF",
            boxShadow: "0 6px 20px rgba(79, 70, 229, 0.35)",
          }}
        >
          <Lock size={28} />
        </div>

        <h3 className="fw-bold text-main mb-1">Reset Password</h3>
        <p className=" fs-6 mb-4">Set your new password below</p>

        {message && (
          <div className={`tp-badge ${isError ? "tp-badge-danger" : "tp-badge-success"} w-100 p-3 mb-3 rounded-3`}>
            <span>{isError ? "⚠️" : "✅"} {message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3 text-start">
            <label className="form-label fw-semibold text-main fs-6">New Password</label>
            <div className="position-relative">
              <span
                className="position-absolute top-50 start-0 translate-middle-y ms-3 "
                style={{ pointerEvents: "none" }}
              >
                <Lock size={18} />
              </span>
              <input
                type="password"
                className="tp-input ps-5"
                placeholder="Enter new password"
                value={newPassword}
                required
                minLength="6"
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4 text-start">
            <label className="form-label fw-semibold text-main fs-6">Confirm Password</label>
            <div className="position-relative">
              <span
                className="position-absolute top-50 start-0 translate-middle-y ms-3 "
                style={{ pointerEvents: "none" }}
              >
                <Lock size={18} />
              </span>
              <input
                type="password"
                className="tp-input ps-5"
                placeholder="Confirm new password"
                value={confirmPassword}
                required
                minLength="6"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="tp-btn tp-btn-primary w-100 py-3 fs-6"
            disabled={isLoading}
          >
            {isLoading ? "Resetting Password..." : "Update Password"} <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
