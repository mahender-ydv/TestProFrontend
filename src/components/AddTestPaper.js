import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FilePlus, ArrowLeft, Clock, Award, FileText } from "lucide-react";

const AddTestPaper = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { subjectId, subjectName } = location.state || {};

  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.REACT_APP_API_URL}/add/add-paper`,
        { title, duration, totalMarks, subjectId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate(-1);
    } catch (error) {
      alert("Failed to add test paper");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4 animate-fade-in" style={{ maxWidth: "680px" }}>
      <div className="d-flex align-items-center gap-3 mb-4">
        <button
          className="tp-btn tp-btn-secondary p-2 rounded-circle border-0"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h3 className="fw-bold text-main mb-0">Create New Test Paper</h3>
          <p className="text-muted mb-0">Subject: {subjectName || "Selected Subject"}</p>
        </div>
      </div>

      <div className="glass-card p-4 p-md-5">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label fw-semibold text-main">Test Paper Title</label>
            <div className="position-relative">
              <FileText size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
              <input
                type="text"
                className="tp-input ps-5"
                placeholder="e.g. Chapter 1 Practice Test"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold text-main">Duration (Minutes)</label>
            <div className="position-relative">
              <Clock size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
              <input
                type="number"
                className="tp-input ps-5"
                placeholder="e.g. 30"
                required
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold text-main">Total Maximum Marks</label>
            <div className="position-relative">
              <Award size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
              <input
                type="number"
                className="tp-input ps-5"
                placeholder="e.g. 100"
                required
                value={totalMarks}
                onChange={(e) => setTotalMarks(e.target.value)}
              />
            </div>
          </div>

          <div className="d-flex justify-content-end gap-3 pt-3 border-top border-subtle">
            <button
              type="button"
              className="tp-btn tp-btn-secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="tp-btn tp-btn-primary px-4"
              disabled={loading}
            >
              <FilePlus size={18} /> {loading ? "Creating..." : "Save Test Paper"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTestPaper;
