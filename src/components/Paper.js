import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FileText,
  Clock,
  Award,
  Play,
  Plus,
  Trash2,
  HelpCircle,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import Modal from "./ui/Modal";

const Paper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { subjectId, subjectName } = location.state || {};

  const [testPapers, setTestPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (subjectId) {
      fetchUserRole();
      fetchPaper();
    }
  }, [subjectId]);

  const fetchUserRole = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRole(res.data.role);
    } catch (error) {
      console.error("Error fetching role:", error);
    }
  };

  const fetchPaper = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/testpapers/${subjectId}`
      );
      setTestPapers(res.data);
    } catch (err) {
      console.error("Failed to fetch test papers:", err);
    } finally {
      setLoading(false);
    }
  };

  const confirmStart = (test) => {
    setSelectedTest(test);
    setShowModal(true);
  };

  const startTest = () => {
    navigate("/startTest", {
      state: {
        testPaperId: selectedTest._id,
        testTitle: selectedTest.title,
        subjectName,
        duration: selectedTest.duration,
      },
    });
  };

  const handleAddQuestion = (test) => {
    navigate("/add-question", {
      state: {
        testPaperId: test._id,
        testTitle: test.title,
      },
    });
  };

  const handleDelete = async (testPaperId) => {
    if (!window.confirm("Are you sure you want to delete this test paper?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${process.env.REACT_APP_API_URL}/add/deletetestpapers/${testPaperId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTestPapers((prev) => prev.filter((test) => test._id !== testPaperId));
    } catch (err) {
      console.error("Failed to delete test paper:", err);
      alert("Error deleting test paper. Please try again.");
    }
  };

  return (
    <div className="container-fluid p-0 animate-fade-in">
      {/* Header Bar */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div className="d-flex align-items-center gap-3">
          <button
            className="tp-btn tp-btn-secondary p-2 rounded-circle border-0"
            onClick={() => navigate("/home")}
            title="Back to Subjects"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="fw-bold text-main mb-1 d-flex align-items-center gap-2">
              {subjectName || "Subject"} Test Papers <Sparkles size={22} className="text-primary" />
            </h2>
            <p className=" mb-0">Select an assessment paper to begin your timed test session.</p>
          </div>
        </div>

        {role === "admin" && (
          <button
            className="tp-btn tp-btn-primary"
            onClick={() =>
              navigate("/add-testpaper", { state: { subjectId, subjectName } })
            }
          >
            <Plus size={18} /> Add New Paper
          </button>
        )}
      </div>

      {/* Content Body */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading test papers...</span>
          </div>
          <p className=" mt-3">Fetching test papers...</p>
        </div>
      ) : testPapers.length === 0 ? (
        <div className="glass-card p-5 text-center my-4">
          <FileText size={48} className=" mb-3" />
          <h4 className="fw-bold text-main">No Test Papers Available</h4>
          <p className="">There are currently no test papers created for {subjectName}.</p>
        </div>
      ) : (
        <div className="row g-4">
          {testPapers.map((test) => (
            <div key={test._id} className="col-12 col-sm-6 col-lg-4">
              <div className="glass-card p-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <span className="tp-badge tp-badge-primary">Assessment</span>
                    <span className=" fs-7 font-mono fw-semibold">ID: {test._id.slice(-6)}</span>
                  </div>

                  <h4 className="fw-bold text-main mb-3">{test.title}</h4>

                  <div className="d-flex align-items-center gap-3 mb-4 flex-wrap">
                    <span className="tp-badge tp-badge-primary py-1 px-2.5 fs-7">
                      <Clock size={14} /> {test.duration} mins
                    </span>
                    <span className="tp-badge tp-badge-success py-1 px-2.5 fs-7">
                      <Award size={14} /> {test.totalMarks} Marks
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-top border-subtle">
                  <button
                    className="tp-btn tp-btn-primary w-100 mb-2 py-2-5"
                    onClick={() => confirmStart(test)}
                  >
                    <Play size={16} /> Start Examination
                  </button>

                  {role === "admin" && (
                    <div className="d-flex gap-2 mt-2">
                      <button
                        className="tp-btn tp-btn-secondary w-50 py-2 fs-7"
                        onClick={() => handleAddQuestion(test)}
                      >
                        <Plus size={14} /> Add Qs
                      </button>
                      <button
                        className="tp-btn tp-btn-danger w-50 py-2 fs-7"
                        onClick={() => handleDelete(test._id)}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Start Test Confirmation Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Start Test Session?"
      >
        {selectedTest && (
          <div>
            <div className="glass-card p-3 mb-3" style={{ backgroundColor: "var(--bg-surface-elevated)" }}>
              <h5 className="fw-bold text-main mb-2">{selectedTest.title}</h5>
              <div className="d-flex gap-3  fs-6">
                <span>⏱️ <strong>Duration:</strong> {selectedTest.duration} minutes</span>
                <span>🏆 <strong>Total Marks:</strong> {selectedTest.totalMarks}</span>
              </div>
            </div>

            <div className="tp-badge tp-badge-warning p-3 rounded-3 mb-4 w-100 text-start">
              <span className="fw-bold d-block mb-1">⚠️ Proctored Instructions:</span>
              <ul className="mb-0 ps-3 fs-6">
                <li>Do not refresh or navigate back during the test.</li>
                <li>Tab switching is recorded and monitored automatically.</li>
                <li>Ensure a stable internet connection before proceeding.</li>
              </ul>
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button className="tp-btn tp-btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="tp-btn tp-btn-success px-4" onClick={startTest}>
                <Play size={16} /> Begin Test Now
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Paper;
