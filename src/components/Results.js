import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Trophy,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Home,
  BarChart3,
  Sparkles,
  ArrowRight,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import StatCard from "./ui/StatCard";

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const { answers, questions, finalScore, wrongQuestion, correctQuestion } =
    location.state || {};

  useEffect(() => {
    if (!answers || !questions) {
      navigate("/home", { replace: true });
    }
  }, [answers, questions, navigate]);

  if (!answers || !questions) return null;

  const totalMarks = questions.length * 4;
  const skippedCount = questions.length - (correctQuestion + wrongQuestion);
  const percentage = Math.max(0, Math.round((finalScore / totalMarks) * 100));
  const isPassed = percentage >= 50;

  return (
    <div
      className="min-vh-100 d-flex flex-column p-4 position-relative animate-fade-in"
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

      <div className="container py-4" style={{ maxWidth: "900px" }}>
        {/* Banner Card */}
        <div className="glass-card p-4 p-md-5 text-center mb-4 position-relative overflow-hidden">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle p-4 mb-3"
            style={{
              background: isPassed
                ? "linear-gradient(135deg, var(--accent-emerald), #059669)"
                : "linear-gradient(135deg, var(--accent-amber), #D97706)",
              color: "#FFF",
              boxShadow: isPassed
                ? "0 10px 25px rgba(16, 185, 129, 0.35)"
                : "0 10px 25px rgba(245, 158, 11, 0.35)",
            }}
          >
            <Trophy size={48} />
          </div>

          <h2 className="display-6 fw-bold text-main mb-1">
            {isPassed ? "Congratulations! Test Completed" : "Assessment Completed"}
          </h2>
          <p className="text-muted fs-5 mb-4">
            {isPassed
              ? "You demonstrated great proficiency in this examination."
              : "Review your answers below to strengthen your weak topics."}
          </p>

          <div className="d-inline-flex align-items-center gap-3 px-4 py-2 rounded-pill glass-panel mb-4">
            <span className="fs-4 fw-extrabold gradient-text">{percentage}% Score</span>
            <span className="text-muted">|</span>
            <span className="fs-5 fw-bold text-main">{finalScore} / {totalMarks} Marks</span>
          </div>

          <div className="d-flex justify-content-center gap-3 mt-2 flex-wrap">
            <button
              className="tp-btn tp-btn-primary px-4 py-2-5"
              onClick={() => navigate("/home")}
            >
              <Home size={18} /> Back to Dashboard
            </button>
            <button
              className="tp-btn tp-btn-secondary px-4 py-2-5"
              onClick={() => navigate("/analyze")}
            >
              <BarChart3 size={18} /> Detailed Performance Analysis
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <StatCard
              title="Correct"
              value={correctQuestion}
              subtitle="+4 Marks Each"
              icon={CheckCircle2}
              color="emerald"
            />
          </div>
          <div className="col-6 col-md-3">
            <StatCard
              title="Incorrect"
              value={wrongQuestion}
              subtitle="-1 Negative"
              icon={XCircle}
              color="rose"
            />
          </div>
          <div className="col-6 col-md-3">
            <StatCard
              title="Skipped"
              value={skippedCount}
              subtitle="0 Penalty"
              icon={AlertCircle}
              color="amber"
            />
          </div>
          <div className="col-6 col-md-3">
            <StatCard
              title="Total Marks"
              value={finalScore}
              subtitle={`Out of ${totalMarks}`}
              icon={Sparkles}
              color="primary"
            />
          </div>
        </div>

        {/* Question-by-Question Review Accordion */}
        <div className="glass-card p-4">
          <h4 className="fw-bold text-main mb-4">Detailed Question Review</h4>

          <div className="d-flex flex-column gap-3">
            {questions.map((q, idx) => {
              const userAnswer = answers[idx]?.selectedOption;
              const isCorrect = userAnswer === q.correctAnswer;
              const isSkipped = !userAnswer;

              return (
                <div
                  key={idx}
                  className="p-3-5 rounded-3 border"
                  style={{
                    backgroundColor: "var(--bg-surface-elevated)",
                    borderColor: isCorrect
                      ? "rgba(16, 185, 129, 0.3)"
                      : isSkipped
                      ? "var(--border-subtle)"
                      : "rgba(244, 63, 94, 0.3)",
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-bold text-main">Question {idx + 1}</span>
                    <span
                      className={`tp-badge ${
                        isCorrect
                          ? "tp-badge-success"
                          : isSkipped
                          ? "tp-badge-warning"
                          : "tp-badge-danger"
                      }`}
                    >
                      {isCorrect ? "Correct (+4)" : isSkipped ? "Skipped (0)" : "Incorrect (-1)"}
                    </span>
                  </div>

                  <p className="fw-semibold text-main mb-3">{q.questionText}</p>

                  <div className="row g-2 fs-6">
                    <div className="col-12 col-md-6">
                      <span className="text-muted d-block fs-7">YOUR RESPONSE:</span>
                      <strong className={isCorrect ? "text-success" : isSkipped ? "text-muted" : "text-danger"}>
                        {userAnswer || "Not Attempted"}
                      </strong>
                    </div>

                    <div className="col-12 col-md-6">
                      <span className="text-muted d-block fs-7">CORRECT ANSWER:</span>
                      <strong className="text-success">{q.correctAnswer}</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
