import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  BookOpen,
  Plus,
  Search,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  GraduationCap,
  Layers,
} from "lucide-react";
import StatCard from "./ui/StatCard";
import Modal from "./ui/Modal";

const ICON_COLORS = [
  { bg: "rgba(99, 102, 241, 0.12)", color: "#6366F1", border: "rgba(99, 102, 241, 0.2)" },
  { bg: "rgba(139, 92, 246, 0.12)", color: "#8B5CF6", border: "rgba(139, 92, 246, 0.2)" },
  { bg: "rgba(16, 185, 129, 0.12)", color: "#10B981", border: "rgba(16, 185, 129, 0.2)" },
  { bg: "rgba(6, 182, 212, 0.12)", color: "#06B6D4", border: "rgba(6, 182, 212, 0.2)" },
  { bg: "rgba(245, 158, 11, 0.12)", color: "#F59E0B", border: "rgba(245, 158, 11, 0.2)" },
  { bg: "rgba(244, 63, 94, 0.12)", color: "#F43F5E", border: "rgba(244, 63, 94, 0.2)" },
];

const ICONS = ["📐", "🔬", "📖", "🌍", "💻", "🎨", "🎵", "📊", "🧪", "🗣️"];

const SubjectCardGrid = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal State for Add Subject
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: "", description: "" });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchSubjects();
    getUserRole();
  }, []);

  const getUserRole = async () => {
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

  const fetchSubjects = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/subjects`);
      setSubjects(res.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubjectSubmit = async (e) => {
    e.preventDefault();
    if (!newSubject.name) return;

    try {
      setAdding(true);
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.REACT_APP_API_URL}/add/add-subject`,
        newSubject,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowAddModal(false);
      setNewSubject({ name: "", description: "" });
      fetchSubjects();
    } catch (err) {
      alert("Error adding subject");
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const handleViewClick = (subject) => {
    navigate("/viewTest", {
      state: { subjectId: subject._id, subjectName: subject.name },
    });
  };

  const filteredSubjects = subjects.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid p-0">
      {/* Top Banner Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-main mb-1 d-flex align-items-center gap-2">
            Subject Library <Sparkles size={24} className="text-primary" />
          </h2>
          <p className=" mb-0">Select a subject to view and attempt available test papers.</p>
        </div>

        {role === "admin" && (
          <button
            className="tp-btn tp-btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={18} /> Add New Subject
          </button>
        )}
      </div>

      {/* Metrics Row */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-md-4">
          <StatCard
            title="Total Subjects"
            value={subjects.length}
            subtitle="Categorized Curriculums"
            icon={Layers}
            color="primary"
          />
        </div>
        <div className="col-12 col-sm-6 col-md-4">
          <StatCard
            title="Learning Tracks"
            value="Active"
            subtitle="Practice & Prep Ready"
            icon={GraduationCap}
            color="emerald"
          />
        </div>
        <div className="col-12 col-sm-6 col-md-4">
          <StatCard
            title="Account Access"
            value={role === "admin" ? "Administrator" : "Student"}
            subtitle="Proctored Assessment Enabled"
            icon={ShieldAlert}
            color="purple"
          />
        </div>
      </div>

      {/* Search & Action Bar */}
      <div className="glass-card p-3 mb-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div className="position-relative flex-grow-1" style={{ maxWidth: "420px" }}>
          <Search size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 " />
          <input
            type="text"
            className="tp-input ps-5"
            placeholder="Search subjects by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <span className="tp-badge tp-badge-primary fs-6 px-3 py-2">
          {filteredSubjects.length} {filteredSubjects.length === 1 ? "Subject" : "Subjects"} Available
        </span>
      </div>

      {/* Subjects Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading subjects...</span>
          </div>
          <p className=" mt-3">Loading available subjects...</p>
        </div>
      ) : filteredSubjects.length === 0 ? (
        <div className="glass-card p-5 text-center my-4">
          <BookOpen size={48} className=" mb-3" />
          <h4 className="fw-bold text-main">No Subjects Found</h4>
          <p className="">Try adjusting your search keywords or add a new subject.</p>
        </div>
      ) : (
        <div className="row g-4">
          {filteredSubjects.map((subject, index) => {
            const palette = ICON_COLORS[index % ICON_COLORS.length];
            const icon = ICONS[index % ICONS.length];
            return (
              <div key={subject._id || index} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                <SubjectCard
                  subject={subject}
                  icon={icon}
                  palette={palette}
                  onView={() => handleViewClick(subject)}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Add Subject Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Subject"
      >
        <form onSubmit={handleAddSubjectSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold text-main">Subject Name</label>
            <input
              type="text"
              className="tp-input"
              placeholder="e.g. Mathematics, Physics..."
              value={newSubject.name}
              onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold text-main">Description</label>
            <textarea
              className="tp-input"
              rows="3"
              placeholder="Brief summary of test topics..."
              value={newSubject.description}
              onChange={(e) => setNewSubject({ ...newSubject, description: e.target.value })}
            />
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="tp-btn tp-btn-secondary"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="tp-btn tp-btn-primary"
              disabled={adding}
            >
              {adding ? "Adding..." : "Add Subject"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

const SubjectCard = ({ subject, icon, palette, onView }) => {
  return (
    <div className="glass-card p-4 h-100 d-flex flex-column justify-content-between position-relative overflow-hidden">
      <div>
        {/* Top Palette Badge */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div
            className="d-flex align-items-center justify-content-center rounded-3 fs-3"
            style={{
              width: "48px",
              height: "48px",
              backgroundColor: palette.bg,
              border: `1px solid ${palette.border}`,
            }}
          >
            {icon}
          </div>
          <span className="tp-badge tp-badge-primary">Course</span>
        </div>

        <span className=" text-uppercase fw-bold fs-7 tracking-wide">Subject</span>
        <h4 className="fw-bold text-main my-1">{subject.name}</h4>
        <p className=" fs-6 mb-4 line-clamp-2">
          {subject.description || `Practice standardized tests and topic assessments for ${subject.name}.`}
        </p>
      </div>

      <button
        className="tp-btn tp-btn-secondary w-100 justify-content-between"
        onClick={onView}
      >
        <span>View Available Papers</span> <ArrowRight size={16} />
      </button>
    </div>
  );
};

export default SubjectCardGrid;
