import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const TestPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    testPaperId,
    subjectName = "Unknown",
    testTitle = "",
    duration = 20,
  } = location.state || {};

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState("");
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [submitted, setSubmitted] = useState(false);
  const [timeUp, setTimeUp] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (!testPaperId) {
      navigate("/home"); // Redirect if accessed directly
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
  }, [currentQuestionIndex]);

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
    alert("Back navigation is disabled during the test.");
  };

  window.addEventListener("popstate", handleBackButton);
  return () => window.removeEventListener("popstate", handleBackButton);
}, []);

  
  

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleOptionChange = (e) => {
    const selected = e.target.value;
    setSelectedOption(selected);
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: {
        selectedOption: selected,
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
      alert("User not logged in!");
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
      .catch((err) => console.error("❌ Error submitting result:", err));

    setSubmitted(true);

    // ✅ Use setTimeout to avoid navigate-during-render error
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

  useEffect(() => {
    let tabSwitchCount = 0;
    let hasWarned = false;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        tabSwitchCount += 1;

        if (!hasWarned && tabSwitchCount === 1) {
          alert("Tab switching is not allowed during the test!");
          hasWarned = true;
        } else if (tabSwitchCount >= 2) {
          alert("You switched tabs multiple times. Test will be submitted.");
          setTimeUp(true); // trigger autoSubmit via useEffect
        }
      }
    };

    const handleBlur = () => {
      // Optional: add additional punishment or message
      console.warn("Window lost focus");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  useEffect(() => {
    const disableRightClick = (e) => e.preventDefault();
    const disableKeydown = (e) => {
      // Block F12, Ctrl+Shift+I, Ctrl+U, etc.
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

  const manualSubmit = () => autoSubmit();

  const answered = Object.keys(answers).length;
  const skipped = questions.length - answered;

  return (
    <div className="container-fluid mt-4">
      <div className="mb-4 text-center">
        <h2 className="text-primary fw-bold">{testTitle}</h2>
        <p>
          <strong>Subject:</strong> {subjectName}
        </p>
        <p>
          <strong>Time Left:</strong> {formatTime(timeLeft)}
        </p>
      </div>

      <div className="row">
        <div className="col-md-8 mb-4">
          <div className="card p-4 shadow-sm">
            {currentQuestion ? (
              <>
                <h5>
                  Q{currentQuestionIndex + 1}. {currentQuestion.questionText}
                </h5>
                <ul className="list-unstyled mt-3">
                  {currentQuestion.options.map((opt, idx) => (
                    <li key={idx}>
                      <label className="d-block">
                        <input
                          type="radio"
                          value={opt}
                          checked={selectedOption === opt}
                          name={`question-${currentQuestionIndex}`}
                          onChange={handleOptionChange}
                        />
                        <span className="ms-2">{opt}</span>
                      </label>
                    </li>
                  ))}
                </ul>

                <div className="d-flex justify-content-between mt-4">
                  <button
                    className="btn btn-secondary"
                    onClick={prevQuestion}
                    disabled={currentQuestionIndex === 0}
                  >
                    Previous
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={nextQuestion}
                    disabled={currentQuestionIndex === questions.length - 1}
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <p>Loading question...</p>
            )}
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3 shadow-sm">
            <h5 className="text-center">📝 Summary</h5>
            <p>
              <strong>Total:</strong> {questions.length}
            </p>
            <p>
              <strong>Answered:</strong> {answered}
            </p>
            <p>
              <strong>Skipped:</strong> {skipped}
            </p>

            <div className="d-flex flex-wrap gap-2 mt-3">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => jumpTo(i)}
                  className={`btn btn-sm ${
                    i === currentQuestionIndex
                      ? "btn-info"
                      : answers[i]
                      ? "btn-success"
                      : "btn-outline-secondary"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-4">
        <button className="btn btn-lg btn-success" onClick={manualSubmit}>
          Finish Test
        </button>
      </div>
    </div>
  );
};

export default TestPage;
