import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { answers, questions, finalScore, wrongQuestion, correctQuestion } =
    location.state || {};

  useEffect(() => {
    if (!answers || !questions) {
      // If accessed directly without test submission
      navigate("/home", { replace: true });
    }
  }, [answers, questions, navigate]);

  if (!answers || !questions) return null;

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow">
        <h2 className="text-center mb-4">Test Result</h2>
        <p><strong>Total Questions:</strong> {questions.length}</p>
        <p><strong>Correct Answers:</strong> {correctQuestion}</p>
        <p><strong>Wrong Answers:</strong> {wrongQuestion}</p>
        <p><strong>Score:</strong> {finalScore} / {questions.length * 4}</p>
        <div className="text-center mt-4">
          <button className="btn btn-primary" onClick={() => navigate("/home")}>
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
