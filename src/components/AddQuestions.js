import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const AddQuestion = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { testPaperId, testTitle } = location.state || {};

  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.REACT_APP_API_URL}/add/add-question`,
        {
          testPaperId,
          questionText,
          options,
          correctAnswer,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("✅ Question added!");
      navigate(-1);
    } catch (err) {
      alert("❌ Failed to add question");
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4">
        Add Question for <strong>{testTitle}</strong>
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Question</label>
          <textarea
            className="form-control"
            rows={3}
            required
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
          />
        </div>

        {options.map((opt, i) => (
          <div key={i} className="mb-2">
            <label>Option {i + 1}</label>
            <input
              className="form-control"
              required
              value={opt}
              onChange={(e) => {
                const newOptions = [...options];
                newOptions[i] = e.target.value;
                setOptions(newOptions);
              }}
            />
          </div>
        ))}

        <div className="mb-3">
          <label>Correct Answer</label>
          <input
            className="form-control"
            required
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
          />
        </div>

        <button className="btn btn-primary">Add Question</button>
      </form>
    </div>
  );
};

export default AddQuestion;
