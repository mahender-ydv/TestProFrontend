import React, { useEffect, useState } from "react";
import axios from "axios";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { BarChart3, Trophy, CheckCircle2, XCircle, Sparkles, Award } from "lucide-react";
import StatCard from "./ui/StatCard";

export default function AllResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/my-results`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setResults(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch results:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading performance...</span>
        </div>
        <p className=" mt-3">Fetching test history & metrics...</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="glass-card p-5 text-center my-4">
        <BarChart3 size={48} className=" mb-3" />
        <h4 className="fw-bold text-main">No Test Results Found</h4>
        <p className="">You haven't attempted any assessments yet. Take a test paper to view insights.</p>
      </div>
    );
  }

  const totalTests = results.length;
  const avgScore = Math.round(
    results.reduce((acc, curr) => acc + (curr.score / curr.totalMarks) * 100, 0) / totalTests
  );

  return (
    <div className="container-fluid p-0 animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-main mb-1 d-flex align-items-center gap-2">
            Performance Analytics <BarChart3 size={24} className="text-primary" />
          </h2>
          <p className=" mb-0">Track your overall assessment history, accuracy rates, and skill rank.</p>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-md-4">
          <StatCard
            title="Total Assessments"
            value={totalTests}
            subtitle="Completed Tests"
            icon={Award}
            color="primary"
          />
        </div>
        <div className="col-12 col-sm-6 col-md-4">
          <StatCard
            title="Average Score"
            value={`${avgScore}%`}
            subtitle="Across All Subjects"
            icon={Trophy}
            color="emerald"
          />
        </div>
        <div className="col-12 col-sm-6 col-md-4">
          <StatCard
            title="Overall Status"
            value={avgScore >= 70 ? "Advanced" : avgScore >= 50 ? "Intermediate" : "Developing"}
            subtitle="Skill Progression"
            icon={Sparkles}
            color="purple"
          />
        </div>
      </div>

      {/* Results Grid */}
      <div className="row g-4">
        {results.map((result) => {
          const { _id, score, totalMarks, correctAnswers, wrongAnswers, testPaperId } = result;
          const percentage = Math.round((score / totalMarks) * 100);
          const testTitle = testPaperId?.title || "Untitled Test Paper";

          let progressColor = "var(--primary-500)";
          let badgeClass = "tp-badge-primary";
          let rankLabel = "Expert Rank";

          if (percentage >= 90) {
            progressColor = "var(--accent-emerald)";
            badgeClass = "tp-badge-success";
            rankLabel = "🎓 Expert";
          } else if (percentage >= 70) {
            progressColor = "var(--primary-500)";
            badgeClass = "tp-badge-primary";
            rankLabel = "🔥 Advanced";
          } else if (percentage >= 50) {
            progressColor = "var(--accent-amber)";
            badgeClass = "tp-badge-warning";
            rankLabel = "👍 Intermediate";
          } else {
            progressColor = "var(--accent-rose)";
            badgeClass = "tp-badge-danger";
            rankLabel = "📘 Beginner";
          }

          return (
            <div key={_id} className="col-12 col-md-6 col-lg-4">
              <div className="glass-card p-4 h-100 d-flex flex-column align-items-center text-center justify-content-between">
                <div className="w-100">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className={`tp-badge ${badgeClass}`}>{rankLabel}</span>
                    <span className=" fs-7 font-mono fw-semibold">
                      {score} / {totalMarks} Marks
                    </span>
                  </div>

                  {/* Circular Progress Bar */}
                  <div style={{ width: 110, height: 110, margin: "0.5rem auto 1.25rem" }}>
                    <CircularProgressbar
                      value={percentage < 0 ? 0 : percentage}
                      text={`${percentage}%`}
                      styles={buildStyles({
                        textSize: "18px",
                        pathColor: progressColor,
                        textColor: "var(--text-main)",
                        trailColor: "var(--border-subtle)",
                        strokeLinecap: "round",
                      })}
                    />
                  </div>

                  <h5 className="fw-bold text-main mb-3 text-truncate">{testTitle}</h5>

                  {/* Metric details */}
                  <div className="glass-panel p-3 rounded-3 mb-3 d-flex justify-content-around">
                    <div>
                      <span className=" fs-7 d-block">CORRECT</span>
                      <strong className="text-success fs-6">
                        <CheckCircle2 size={14} className="me-1" /> {correctAnswers}
                      </strong>
                    </div>
                    <div className="vr border-subtle" />
                    <div>
                      <span className=" fs-7 d-block">INCORRECT</span>
                      <strong className="text-danger fs-6">
                        <XCircle size={14} className="me-1" /> {wrongAnswers}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
