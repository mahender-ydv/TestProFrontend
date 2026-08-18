import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, Sun, Moon } from "lucide-react";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";

export default function Signup() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { name, email, password } = formData;

    if (!name || !email || !password) {
      return setError("All fields are required");
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/signup`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        localStorage.setItem("email", formData.email);
        setTimeout(() => {
          navigate("/verifyOtp");
        }, 0);
      } else {
        setError(res.data.message || "Signup failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
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
        className="glass-card w-100 p-4 p-md-5 animate-fade-in"
        style={{ maxWidth: "460px" }}
      >
        <div className="text-center mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-3 p-3 mb-3"
            style={{
              background: "linear-gradient(135deg, var(--primary-600), var(--accent-purple))",
              color: "#FFF",
              boxShadow: "0 6px 20px rgba(79, 70, 229, 0.35)",
            }}
          >
            <Sparkles size={28} />
          </div>
          <h3 className="fw-bold text-main mb-1">Create Account</h3>
          <p className="text-muted fs-6">Join TestPro to start practicing tests</p>
        </div>

        {error && (
          <div className="tp-badge tp-badge-danger w-100 p-3 mb-3 rounded-3 d-flex align-items-center gap-2">
            <span>⚠️ {error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-3">
            <label className="form-label fw-semibold text-main fs-6">Full Name</label>
            <div className="position-relative">
              <span
                className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                style={{ pointerEvents: "none" }}
              >
                <User size={18} />
              </span>
              <input
                type="text"
                name="name"
                className="tp-input ps-5"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label fw-semibold text-main fs-6">Email Address</label>
            <div className="position-relative">
              <span
                className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                style={{ pointerEvents: "none" }}
              >
                <Mail size={18} />
              </span>
              <input
                type="email"
                name="email"
                className="tp-input ps-5"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label fw-semibold text-main fs-6">Password</label>
            <div className="position-relative">
              <span
                className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                style={{ pointerEvents: "none" }}
              >
                <Lock size={18} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="tp-input ps-5 pe-5"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 text-muted p-1 border-0"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="tp-btn tp-btn-primary w-100 py-3 mt-3 fs-6"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Register Now"} <ArrowRight size={18} />
          </button>
        </form>

        <div className="text-center mt-4 pt-3 border-top border-subtle text-muted fs-6">
          Already have an account?{" "}
          <span
            className="text-primary fw-bold cursor-pointer"
            onClick={() => navigate("/login")}
            style={{ cursor: "pointer" }}
          >
            Sign In
          </span>
        </div>
      </div>
    </div>
  );
}
