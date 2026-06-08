import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home", { replace: true }); 
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.data.success) {
        const { jwtToken, email, name, role, _id } = res.data;

        // Save to localStorage
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("email", email);
        localStorage.setItem(
          "user",
          JSON.stringify({ name, email, role, _id })
        );

       
        navigate("/home");
      } else {
        setError(res.data.message || "Login failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Server error. Try again.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4 w-100" style={{ maxWidth: "400px" }}>
        <h3 className="text-center text-primary mb-2">Welcome Back!</h3>
        <p className="text-center text-muted">Sign in to continue</p>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-3 position-relative">
            <label className="form-label fw-semibold">Email</label>
            <div className="input-group">
              <span className="input-group-text bg-white">
                <FontAwesomeIcon icon={faUser} />
              </span>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-2 position-relative">
            <label className="form-label fw-semibold">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-white">
                <FontAwesomeIcon icon={faLock} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-control"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span
                className="input-group-text bg-white"
                onClick={togglePasswordVisibility}
                style={{ cursor: "pointer" }}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </span>
            </div>
            <div className="text-end mt-1">
              <span
                className="text-primary text-decoration-underline small"
                onClick={() => navigate("/forgot-password")}
                style={{ cursor: "pointer" }}
              >
                Forgot Password?
              </span>
            </div>
          </div>

          {error && <div className="alert alert-danger mt-2">{error}</div>}

          <button type="submit" className="btn btn-primary w-100 mt-3">
            Login
          </button>
        </form>

        <p className="text-center mt-3 text-muted">
          Don't have an account?{" "}
          <span
            className="text-primary text-decoration-underline"
            onClick={() => navigate("/signup")}
            style={{ cursor: "pointer" }}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}
