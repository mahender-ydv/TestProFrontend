import React, { useState } from "react";
import { Mail, Sparkles, ArrowLeft, Send, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function ForgotPassword() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setIsError(!res.ok);
      setMessage(data.message || "Something went wrong.");
    } catch (err) {
      setIsError(true);
      setMessage("Server error. Please try again.");
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
          <Mail size={28} />
        </div>

        <h3 className="fw-bold text-main mb-1">Forgot Password?</h3>
        <p className=" fs-6 mb-4">
          Enter your registered email address to receive password reset instructions.
        </p>

        {message && (
          <div className={`tp-badge ${isError ? "tp-badge-danger" : "tp-badge-success"} w-100 p-3 mb-3 rounded-3`}>
            <span>{isError ? "⚠️" : "✅"} {message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="position-relative">
              <span
                className="position-absolute top-50 start-0 translate-middle-y ms-3 "
                style={{ pointerEvents: "none" }}
              >
                <Mail size={18} />
              </span>
              <input
                type="email"
                className="tp-input ps-5"
                placeholder="name@example.com"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="tp-btn tp-btn-primary w-100 py-3 fs-6"
            disabled={isLoading}
          >
            {isLoading ? "Sending Reset Link..." : "Send Reset Link"} <Send size={18} />
          </button>
        </form>

        <div className="mt-4 pt-3 border-top border-subtle">
          <button
            onClick={() => navigate("/login")}
            className="tp-btn tp-btn-secondary border-0 w-100"
          >
            <ArrowLeft size={16} /> Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
