import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { PlusCircle, ArrowLeft, HelpCircle, CheckCircle, Upload } from "lucide-react";
import FileUploadSystem from "./FileUploadSystem";

const AddQuestion = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { testPaperId, testTitle } = location.state || {};

  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("manual"); // 'manual' | 'bulk'

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
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
      alert("✅ Question added successfully!");
      setQuestionText("");
      setOptions(["", "", "", ""]);
      setCorrectAnswer("");
    } catch (err) {
      alert("❌ Failed to add question");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4 animate-fade-in" style={{ maxWidth: "780px" }}>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div className="d-flex align-items-center gap-3">
          <button
            className="tp-btn tp-btn-secondary p-2 rounded-circle border-0"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h3 className="fw-bold text-main mb-0">Add Questions</h3>
            <p className=" mb-0">Test Paper: {testTitle || "Selected Paper"}</p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="d-flex gap-2 p-1 rounded-3 glass-panel">
          <button
            className={`tp-btn py-1-5 px-3 fs-7 ${activeTab === "manual" ? "tp-btn-primary" : "tp-btn-secondary border-0"}`}
            onClick={() => setActiveTab("manual")}
          >
            Single Entry
          </button>
          <button
            className={`tp-btn py-1-5 px-3 fs-7 ${activeTab === "bulk" ? "tp-btn-primary" : "tp-btn-secondary border-0"}`}
            onClick={() => setActiveTab("bulk")}
          >
            <Upload size={14} /> Bulk Upload
          </button>
        </div>
      </div>

      {activeTab === "manual" ? (
        <div className="glass-card p-4 p-md-5">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label fw-semibold text-main">Question Text</label>
              <textarea
                className="tp-input"
                rows={3}
                placeholder="Enter the question statement..."
                required
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold text-main">Multiple Choice Options</label>
              <div className="row g-3">
                {options.map((opt, i) => (
                  <div key={i} className="col-12 col-md-6">
                    <div className="input-group">
                      <span className="input-group-text glass-panel  fw-bold">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <input
                        type="text"
                        className="tp-input"
                        placeholder={`Option ${String.fromCharCode(65 + i)}`}
                        required
                        value={opt}
                        onChange={(e) => {
                          const newOptions = [...options];
                          newOptions[i] = e.target.value;
                          setOptions(newOptions);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold text-main">Correct Answer</label>
              <div className="position-relative">
                <CheckCircle size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-success" />
                <input
                  type="text"
                  className="tp-input ps-5"
                  placeholder="Enter exact option text corresponding to correct answer"
                  required
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                />
              </div>
            </div>

            <div className="d-flex justify-content-end gap-3 pt-3 border-top border-subtle">
              <button
                type="button"
                className="tp-btn tp-btn-secondary"
                onClick={() => navigate(-1)}
              >
                Done / Finish
              </button>
              <button
                type="submit"
                className="tp-btn tp-btn-primary px-4"
                disabled={loading}
              >
                <PlusCircle size={18} /> {loading ? "Adding..." : "Add Question"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <FileUploadSystem testPaperId={testPaperId} />
      )}
    </div>
  );
};

export default AddQuestion;
