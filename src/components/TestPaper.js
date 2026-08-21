import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Clock, ShieldAlert, CheckCircle, ArrowLeft, ArrowRight, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import Modal from "./ui/Modal";

const TestPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();

  const {
    testPaperId,
    subjectName = "Unknown",
    testTitle = "Assessment Test",
    duration = 20,
  } = location.state || {};

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState("");
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [submitted, setSubmitted] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (!testPaperId) {
      navigate("/home");
      return;
    }

    const fetchQuestions = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/questions/${testPaperId}`
        );
        setQuestions(res.data);
      } catch (err) {
        console.error("Failed to fetch questions:", err);
      }
    };

    fetchQuestions();
  }, [testPaperId, navigate]);

  useEffect(() => {
    if (timeUp && !submitted) {
      autoSubmit();
    }
  }, [timeUp, submitted]);

  useEffect(() => {
    setSelectedOption(answers[currentQuestionIndex]?.selectedOption || "");
  }, [currentQuestionIndex, answers]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeUp(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const handleBackButton = (e) => {
      e.preventDefault();
      window.history.pushState(null, "", window.location.href);
      alert("Back navigation is disabled during the active test session.");
    };

    window.addEventListener("popstate", handleBackButton);
    return () => window.removeEventListener("popstate", handleBackButton);
  }, []);

  useEffect(() => {
    let tabSwitchCount = 0;
    let hasWarned = false;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        tabSwitchCount += 1;

        if (!hasWarned && tabSwitchCount === 1) {
          alert("Warning: Tab switching is strictly monitored during the test!");
          hasWarned = true;
        } else if (tabSwitchCount >= 2) {
          alert("Multiple tab switches detected. Your test is being auto-submitted.");
          setTimeUp(true);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const disableRightClick = (e) => e.preventDefault();
    const disableKeydown = (e) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.key === "U")
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", disableRightClick);
    document.addEventListener("keydown", disableKeydown);

    return () => {
      document.removeEventListener("contextmenu", disableRightClick);
      document.removeEventListener("keydown", disableKeydown);
    };
  }, []);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleOptionSelect = (opt) => {
    setSelectedOption(opt);
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: {
        selectedOption: opt,
        correctAnswer: currentQuestion.correctAnswer,
      },
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1)
      setCurrentQuestionIndex((prev) => prev + 1);
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex((prev) => prev - 1);
  };

  const jumpTo = (index) => setCurrentQuestionIndex(index);

  const autoSubmit = () => {
    if (submitted || questions.length === 0 || !testPaperId) return;

    let correct = 0,
      wrong = 0;
    questions.forEach((q, i) => {
      const userAnswer = answers[i]?.selectedOption;
      if (userAnswer === q.correctAnswer) correct++;
      else if (userAnswer) wrong++;
    });

    const score = correct * 4 + wrong * -1;
    const totalMarks = questions.length * 4;

    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !user._id) {
      alert("User session invalid. Please log in.");
      return;
    }

    const payload = {
      testPaperId,
      score,
      totalMarks,
      correctAnswers: correct,
      wrongAnswers: wrong,
    };

    axios
      .post(`${process.env.REACT_APP_API_URL}/api/submit`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .catch((err) => console.error("Error submitting result:", err));

    setSubmitted(true);

    setTimeout(() => {
      navigate("/results", {
        state: {
          answers,
          questions,
          totalMarks,
          finalScore: score,
          wrongQuestion: wrong,
          correctQuestion: correct,
        },
        replace: true,
      });
    }, 0);
  };

  const answeredCount = Object.keys(answers).length;
  const skippedCount = questions.length - answeredCount;
  const isTimeCritical = timeLeft < 300; // less than 5 mins

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: "var(--bg-app)" }}>
      {/* Exam Header Bar */}
      <header className="glass-panel px-4 py-3 sticky-top shadow-sm" style={{ zIndex: 100 }}>
        <div className="container-fluid d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <span className="tp-badge tp-badge-primary mb-1">{subjectName}</span>
            <h4 className="fw-bold text-main mb-0">{testTitle}</h4>
          </div>

          <div className="d-flex align-items-center gap-3">
            {/* Live Timer Pill */}
            <div
              className={`d-flex align-items-center gap-2 px-3 py-2 rounded-pill fw-bold fs-5 ${
                isTimeCritical ? "bg-danger text-white animate-glow" : "glass-card text-main"
              }`}
              style={{ border: isTimeCritical ? "none" : "1px solid var(--border-strong)" }}
            >
              <Clock size={20} className={isTimeCritical ? "text-white" : "text-primary"} />
              <span>{formatTime(timeLeft)}</span>
            </div>

            <button
              onClick={toggleTheme}
              className="tp-btn tp-btn-secondary p-2 rounded-circle border-0"
              style={{ width: "40px", height: "40px" }}
            >
              {isDark ? <Sun size={18} className="text-warning" /> : <Moon size={18} className="text-primary" />}
            </button>

            <button
              className="tp-btn tp-btn-success py-2 px-3 fs-6"
              onClick={() => setShowConfirmModal(true)}
            >
              <CheckCircle size={18} /> Submit Test
            </button>
          </div>
        </div>
      </header>

      {/* Main Examination Area */}
      <div className="container-fluid p-4 flex-grow-1">
        <div className="row g-4">
          {/* Question Panel */}
          <div className="col-12 col-lg-8">
            <div className="glass-card p-4 p-md-5 h-100 d-flex flex-column justify-content-between">
              {currentQuestion ? (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <span className="tp-badge tp-badge-primary fs-6">
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </span>
                    <span className=" fs-6 fw-semibold">+4 Marks / -1 Negative</span>
                  </div>

                  <h4 className="fw-bold text-main lh-base mb-4">
                    {currentQuestion.questionText}
                  </h4>

                  {/* Options List */}
                  <div className="d-flex flex-column gap-3 mb-4">
                    {currentQuestion.options.map((opt, idx) => {
                      const isSelected = selectedOption === opt;
                      return (
                        <div
                          key={idx}
                          onClick={() => handleOptionSelect(opt)}
                          className={`p-3 rounded-3 border d-flex align-items-center gap-3 cursor-pointer transition-all ${
                            isSelected
                              ? "bg-primary text-white border-primary shadow-sm"
                              : "glass-panel hover-surface text-main"
                          }`}
                          style={{ cursor: "pointer" }}
                        >
                          <div
                            className={`rounded-circle d-flex align-items-center justify-content-center fw-bold fs-7 ${
                              isSelected
                                ? "bg-white text-primary"
                                : "border border-secondary "
                            }`}
                            style={{ width: "28px", height: "28px" }}
                          >
                            {String.fromCharCode(65 + idx)}
                          </div>
                          <span className="fs-6 fw-medium">{opt}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading question...</span>
                  </div>
                </div>
              )}

              {/* Bottom Controls */}
              <div className="d-flex justify-content-between align-items-center pt-3 border-top border-subtle">
                <button
                  className="tp-btn tp-btn-secondary px-4"
                  onClick={prevQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  <ArrowLeft size={16} /> Previous
                </button>

                <button
                  className="tp-btn tp-btn-primary px-4"
                  onClick={nextQuestion}
                  disabled={currentQuestionIndex === questions.length - 1}
                >
                  Next Question <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Right Palette & Stats Panel */}
          <div className="col-12 col-lg-4">
            <div className="glass-card p-4">
              <h5 className="fw-bold text-main mb-3 d-flex align-items-center gap-2">
                <ShieldAlert size={20} className="text-primary" /> Question Palette
              </h5>

              {/* Stats Bar */}
              <div className="row g-2 mb-4 text-center">
                <div className="col-4">
                  <div className="p-2 rounded-3" style={{ backgroundColor: "rgba(16, 185, 129, 0.15)", color: "var(--accent-emerald)" }}>
                    <h5 className="fw-bold mb-0">{answeredCount}</h5>
                    <span className="fs-7 fw-semibold">Answered</span>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-2 rounded-3" style={{ backgroundColor: "rgba(244, 63, 94, 0.15)", color: "var(--accent-rose)" }}>
                    <h5 className="fw-bold mb-0">{skippedCount}</h5>
                    <span className="fs-7 fw-semibold">Skipped</span>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-2 rounded-3" style={{ backgroundColor: "rgba(99, 102, 241, 0.15)", color: "var(--primary-500)" }}>
                    <h5 className="fw-bold mb-0">{questions.length}</h5>
                    <span className="fs-7 fw-semibold">Total</span>
                  </div>
                </div>
              </div>

              {/* Palette Grid */}
              <div className="d-flex flex-wrap gap-2 justify-content-start mb-4" style={{ maxHeight: "300px", overflowY: "auto" }}>
                {questions.map((_, i) => {
                  const isCurrent = i === currentQuestionIndex;
                  const isAnswered = answers[i];

                  return (
                    <button
                      key={i}
                      onClick={() => jumpTo(i)}
                      className={`tp-btn p-0 rounded-3 fw-bold fs-6 ${
                        isCurrent
                          ? "tp-btn-primary"
                          : isAnswered
                          ? "tp-btn-success"
                          : "tp-btn-secondary"
                      }`}
                      style={{ width: "42px", height: "42px" }}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>

              <button
                className="tp-btn tp-btn-success w-100 py-3 fs-6"
                onClick={() => setShowConfirmModal(true)}
              >
                Finish & Submit Test
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Submission Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Submit Examination?"
      >
        <p className=" fs-6 mb-3">
          Are you sure you want to finish and submit your test paper?
        </p>

        <div className="glass-card p-3 mb-4" style={{ backgroundColor: "var(--bg-surface-elevated)" }}>
          <div className="d-flex justify-content-between mb-2">
            <span className="">Total Questions:</span>
            <strong className="text-main">{questions.length}</strong>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span className="">Questions Answered:</span>
            <strong className="text-success">{answeredCount}</strong>
          </div>
          <div className="d-flex justify-content-between">
            <span className="">Unanswered / Skipped:</span>
            <strong className="text-danger">{skippedCount}</strong>
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2">
          <button
            className="tp-btn tp-btn-secondary"
            onClick={() => setShowConfirmModal(false)}
          >
            Continue Test
          </button>
          <button className="tp-btn tp-btn-success px-4" onClick={autoSubmit}>
            Confirm Submit
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default TestPage;
