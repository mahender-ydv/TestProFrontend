import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound, Sparkles, ArrowRight, RefreshCw, Sun, Moon } from "lucide-react";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (!storedEmail) {
      setError("Email not found. Please register again.");
    } else {
      setEmail(storedEmail);
    }
  }, []);

  const handleChange = (e) => {
    setOtp(e.target.value);
    setError("");
    setSuccessMessage("");
  };

  const validateOtp = () => {
    if (!otp) return "OTP is required";
    if (!/^\d{6}$/.test(otp)) return "OTP must be 6 digits";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateOtp();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsVerifying(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/verify-otp`,
        { otp, email },
        { headers: { "Content-Type": "application/json" } }
      );

      setSuccessMessage(response.data.message || "OTP Verified Successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to verify OTP.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      setError("Email is missing. Cannot resend OTP.");
      return;
    }

    setIsResending(true);
    setError("");
    setSuccessMessage("");

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/resend-otp`,
        { email },
        { headers: { "Content-Type": "application/json" } }
      );

      setSuccessMessage("OTP has been resent to your email.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setIsResending(false);
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
          <KeyRound size={28} />
        </div>

        <h3 className="fw-bold text-main mb-1">Enter Verification Code</h3>
        <p className="text-muted fs-6 mb-4">
          {email ? (
            <>
              We sent a 6-digit OTP code to <strong className="text-main">{email}</strong>
            </>
          ) : (
            "Loading email address..."
          )}
        </p>

        {error && (
          <div className="tp-badge tp-badge-danger w-100 p-3 mb-3 rounded-3">
            <span>⚠️ {error}</span>
          </div>
        )}

        {successMessage && (
          <div className="tp-badge tp-badge-success w-100 p-3 mb-3 rounded-3">
            <span>✅ {successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              value={otp}
              onChange={handleChange}
              className="tp-input text-center fs-3 fw-bold tracking-wider"
              placeholder="••••••"
              maxLength="6"
              style={{ letterSpacing: "0.3em" }}
            />
          </div>

          <button
            type="submit"
            className="tp-btn tp-btn-primary w-100 py-3 fs-6"
            disabled={isVerifying}
          >
            {isVerifying ? "Verifying OTP..." : "Verify & Continue"} <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-4 pt-3 border-top border-subtle">
          <button
            onClick={handleResendOtp}
            className="tp-btn tp-btn-secondary text-primary border-0 w-100"
            disabled={isResending}
          >
            <RefreshCw size={16} className={isResending ? "animate-spin" : ""} />
            {isResending ? "Resending OTP..." : "Resend Verification Code"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
