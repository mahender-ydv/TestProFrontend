import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

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
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Refresh list
    setTestPapers((prev) => prev.filter((test) => test._id !== testPaperId));
  } catch (err) {
    console.error("Failed to delete test paper:", err);
    alert("Error deleting test paper. Please try again.");
  }
};


  return (
  <div className="container my-5">
  <h2 className="text-center fw-bold mb-4">
    📘 <span className="text-primary">Test Papers</span> for <span className="text-dark">{subjectName}</span>
  </h2>

  {/* Admin Add Button */}
  {role === "admin" && (
    <div className="d-flex justify-content-end mb-4">
      <button
        className="btn btn-success"
        onClick={() =>
          navigate("/add-testpaper", { state: { subjectId, subjectName } })
        }
      >
        ➕ Add New Test Paper
      </button>
    </div>
  )}

  {/* Loading Spinner */}
  {loading ? (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "50vh" }}
    >
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  ) : testPapers.length === 0 ? (
    <div className="text-center text-muted mt-5">
      <h5>😕 No test papers found for this subject.</h5>
    </div>
  ) : (
    <div className="row g-4">
      {testPapers.map((test) => (
        <div key={test._id} className="col-12 col-sm-6 col-lg-4">
          <div className="card shadow-sm h-100 border-0">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title text-primary fw-bold mb-2">{test.title}</h5>

              <div className="mb-3">
                <span className="badge bg-light text-dark me-2">
                  🕒 {test.duration} min
                </span>
                <span className="badge bg-secondary">
                  🎯 {test.totalMarks} marks
                </span>
              </div>

              {/* Action Buttons */}
              <div className="mt-auto">
                <button
                  className="btn btn-outline-primary w-100 mb-2"
                  onClick={() => confirmStart(test)}
                >
                  ▶️ Start Test
                </button>

                {role === "admin" && (
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-warning w-50"
                      onClick={() => handleAddQuestion(test)}
                    >
                      ➕ Add Qs
                    </button>
                    <button
                      className="btn btn-outline-danger w-50"
                      onClick={() => handleDelete(test._id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}

  {/* Start Test Modal */}
  {showModal && selectedTest && (
    <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow">
          <div className="modal-header">
            <h5 className="modal-title">Start Test?</h5>
            <button
              className="btn-close"
              onClick={() => setShowModal(false)}
            ></button>
          </div>
          <div className="modal-body">
            <p><strong>Test:</strong> {selectedTest.title}</p>
            <p><strong>Duration:</strong> {selectedTest.duration} min</p>
            <p><strong>Total Marks:</strong> {selectedTest.totalMarks}</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
              Cancel
            </button>
            <button className="btn btn-success" onClick={startTest}>
              ✅ Start Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )}
</div>


  );
};

export default Paper;
