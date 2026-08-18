import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  BookOpen,
  CheckCircle2,
  Code,
  Award,
  ArrowRight,
  Shield,
  Zap,
  Users,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const LandingPage = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: "var(--bg-app)" }}>
      {/* Top Navbar */}
      <nav className="navbar fixed-top glass-panel px-4 py-3">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <div
              className="d-flex align-items-center justify-content-center rounded-3 p-2"
              style={{
                background: "linear-gradient(135deg, var(--primary-600), var(--accent-purple))",
                color: "#FFF",
              }}
            >
              <Sparkles size={22} />
            </div>
            <span className="fs-3 fw-bold gradient-text">TestPro</span>
          </div>

          <div className="d-flex align-items-center gap-3">
            <button
              onClick={toggleTheme}
              className="tp-btn tp-btn-secondary p-2 rounded-circle border-0"
              style={{ width: "42px", height: "42px" }}
              title="Toggle theme"
            >
              {isDark ? <Sun size={20} className="text-warning" /> : <Moon size={20} className="text-primary" />}
            </button>
            <button
              className="tp-btn tp-btn-secondary px-3 py-2"
              onClick={() => navigate("/login")}
            >
              Sign In
            </button>
            <button
              className="tp-btn tp-btn-primary px-4 py-2"
              onClick={() => navigate("/signup")}
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-5 mt-5 pb-5 px-3 text-center position-relative overflow-hidden">
        {/* Decorative background glows */}
        <div
          className="position-absolute rounded-circle"
          style={{
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(0,0,0,0) 70%)",
            top: "-100px",
            left: "50%",
            transform: "translateX(-50%)",
            pointerEvents: "none",
          }}
        />

        <div className="container py-5 position-relative">
          <span className="tp-badge tp-badge-primary mb-3 px-3 py-2 fs-6 animate-glow">
            <Sparkles size={16} className="me-1" /> Next-Gen Online Assessment Platform
          </span>

          <h1 className="display-3 fw-extrabold my-3 text-main" style={{ maxWidth: "850px", margin: "0 auto" }}>
            Master Your Skills with Intelligent <span className="gradient-text">Online Testing</span>
          </h1>

          <p className="lead text-muted max-w-2xl mx-auto my-4 fs-5" style={{ maxWidth: "680px", margin: "0 auto" }}>
            Comprehensive topic-wise assessments, detailed real-time performance analytics, proctored exam simulation, and learning resources designed to elevate your success.
          </p>

          <div className="d-flex justify-content-center gap-3 mt-4 flex-wrap">
            <button
              className="tp-btn tp-btn-primary px-4 py-3 fs-5"
              onClick={() => navigate("/login")}
            >
              Start Free Assessment <ArrowRight size={20} />
            </button>
            <button
              className="tp-btn tp-btn-secondary px-4 py-3 fs-5"
              onClick={() => navigate("/signup")}
            >
              Create Account
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="row g-4 mt-5 pt-4 justify-content-center">
            <div className="col-6 col-md-3">
              <div className="glass-card p-3 text-center">
                <h3 className="fw-bold gradient-text mb-0">100+</h3>
                <span className="text-muted fs-6">Subject Tests</span>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="glass-card p-3 text-center">
                <h3 className="fw-bold gradient-text-cyan mb-0">99.8%</h3>
                <span className="text-muted fs-6">Accuracy Rate</span>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="glass-card p-3 text-center">
                <h3 className="fw-bold text-success mb-0">Real-time</h3>
                <span className="text-muted fs-6">Instant Analytics</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 px-3" style={{ backgroundColor: "var(--bg-surface)" }}>
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="tp-badge tp-badge-primary mb-2">FEATURES</span>
            <h2 className="display-5 fw-bold text-main">Why Choose TestPro?</h2>
            <p className="text-muted fs-5">Everything you need for standardized, proctored, and effective testing.</p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="glass-card h-100 p-4 d-flex flex-column gap-3">
                <div
                  className="rounded-3 p-3 d-inline-flex"
                  style={{
                    backgroundColor: "rgba(99, 102, 241, 0.15)",
                    color: "var(--primary-500)",
                    width: "fit-content",
                  }}
                >
                  <BookOpen size={28} />
                </div>
                <h4 className="fw-bold text-main mb-0">Topic-wise Assessments</h4>
                <p className="text-muted mb-0">
                  Attempt structured tests categorized by subject, chapter, and difficulty levels to sharpen targeted concepts.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="glass-card h-100 p-4 d-flex flex-column gap-3">
                <div
                  className="rounded-3 p-3 d-inline-flex"
                  style={{
                    backgroundColor: "rgba(139, 92, 246, 0.15)",
                    color: "var(--accent-purple)",
                    width: "fit-content",
                  }}
                >
                  <Shield size={28} />
                </div>
                <h4 className="fw-bold text-main mb-0">Proctored Exam Room</h4>
                <p className="text-muted mb-0">
                  Simulate official exam conditions with countdown timers, tab switch monitoring, and automatic response saving.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="glass-card h-100 p-4 d-flex flex-column gap-3">
                <div
                  className="rounded-3 p-3 d-inline-flex"
                  style={{
                    backgroundColor: "rgba(16, 185, 129, 0.15)",
                    color: "var(--accent-emerald)",
                    width: "fit-content",
                  }}
                >
                  <Zap size={28} />
                </div>
                <h4 className="fw-bold text-main mb-0">Instant Score Insights</h4>
                <p className="text-muted mb-0">
                  Receive detailed performance reports with question-by-question breakdown, accuracy percentage, and score trends.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-5 px-3">
        <div className="container py-4">
          <h2 className="text-center fw-bold display-6 mb-5 text-main">Trusted by Students & Educators</h2>
          <div className="row g-4">
            <div className="col-md-6">
              <div className="glass-card p-4 h-100 d-flex flex-column justify-content-between">
                <p className="fs-5 text-muted fst-italic">
                  "TestPro provided me with real exam practice environment. The immediate analytics helped me identify my weak topics and score top marks in entrance exams!"
                </p>
                <div className="d-flex align-items-center gap-3 mt-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white"
                    style={{ width: "48px", height: "48px", background: "linear-gradient(135deg, #4F46E5, #8B5CF6)" }}
                  >
                    MY
                  </div>
                  <div>
                    <h6 className="fw-bold text-main mb-0">Mahender Yadav</h6>
                    <span className="text-muted fs-6">Software Engineer & Student</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="glass-card p-4 h-100 d-flex flex-column justify-content-between">
                <p className="fs-5 text-muted fst-italic">
                  "The UI is incredibly smooth and responsive. Being able to take tests seamlessly on any device with dark mode support makes studying enjoyable."
                </p>
                <div className="d-flex align-items-center gap-3 mt-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white"
                    style={{ width: "48px", height: "48px", background: "linear-gradient(135deg, #06B6D4, #10B981)" }}
                  >
                    SK
                  </div>
                  <div>
                    <h6 className="fw-bold text-main mb-0">Suraj Kumar</h6>
                    <span className="text-muted fs-6">Computer Science Aspirant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-4 px-3 border-top border-subtle text-center text-muted" style={{ backgroundColor: "var(--bg-surface)" }}>
        <div className="container">
          <p className="mb-0 fs-6">&copy; {new Date().getFullYear()} TestPro Systems. Built with precision and care.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
