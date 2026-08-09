import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ICON_COLORS = [
  { bg: "#E6F1FB", color: "#185FA5", light: "#B5D4F4" },
  { bg: "#E1F5EE", color: "#0F6E56", light: "#9FE1CB" },
  { bg: "#FAEEDA", color: "#854F0B", light: "#FAC775" },
  { bg: "#EEEDFE", color: "#534AB7", light: "#CECBF6" },
  { bg: "#FBEAF0", color: "#993556", light: "#F4C0D1" },
  { bg: "#EAF3DE", color: "#3B6D11", light: "#C0DD97" },
];

const ICONS = ["📐", "🔬", "📖", "🌍", "💻", "🎨", "🎵", "📊", "🧪", "🗣️"];

const SubjectCardGrid = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const handleAddSubject = async () => {
    const name = prompt("Enter subject name:");
    const description = prompt("Enter description:");
    if (!name) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.REACT_APP_API_URL}/add/add-subject`,
        { name, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Subject added successfully!");
      fetchSubjects();
    } catch (err) {
      alert("Error adding subject");
      console.error(err);
    }
  };

  const handleViewClick = (subject) => {
    navigate("/viewTest", {
      state: { subjectId: subject._id, subjectName: subject.name },
    });
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.pageTitle}>Subjects</h1>
          <span style={styles.countBadge}>
            {subjects.length} subject{subjects.length !== 1 ? "s" : ""}
          </span>
        </div>
        {role === "admin" && (
          <button style={styles.addBtn} onClick={handleAddSubject}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Add Subject
          </button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div style={styles.emptyState}>Loading subjects...</div>
      ) : subjects.length === 0 ? (
        <div style={styles.emptyState}>No subjects found.</div>
      ) : (
        <div style={styles.grid}>
          {subjects.map((subject, index) => {
            const palette = ICON_COLORS[index % ICON_COLORS.length];
            const icon = ICONS[index % ICONS.length];
            return (
              <SubjectCard
                key={subject._id || index}
                subject={subject}
                icon={icon}
                palette={palette}
                onView={() => handleViewClick(subject)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

const SubjectCard = ({ subject, icon, palette, onView }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.card,
        borderColor: hovered ? palette.light : "#e5e7eb",
        background: hovered ? "#fafafa" : "#ffffff",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Icon */}
      <div style={{ ...styles.iconBox, background: palette.bg }}>
        <span style={styles.iconEmoji}>{icon}</span>
      </div>

      {/* Meta */}
      <p style={styles.subjectLabel}>Subject</p>
      <h3 style={styles.subjectName}>{subject.name}</h3>

      {/* Divider */}
      <div style={styles.divider} />

      {/* Description */}
      <p style={styles.subjectDesc}>
        {subject.description ||
          `Practice tests and assessments for ${subject.name}.`}
      </p>

      {/* View Button */}
      <button
        style={{
          ...styles.viewBtn,
          background: hovered ? palette.bg : "transparent",
          color: hovered ? palette.color : "#374151",
          borderColor: hovered ? palette.light : "#d1d5db",
        }}
        onClick={onView}
      >
        View tests <span style={{ marginLeft: 4 }}>→</span>
      </button>
    </div>
  );
};

const styles = {
  page: {
    padding: "2rem 1.5rem",
    maxWidth: 1100,
    margin: "0 auto",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.75rem",
    flexWrap: "wrap",
    gap: 12,
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 600,
    color: "#111827",
    margin: 0,
  },
  countBadge: {
    fontSize: 12,
    fontWeight: 500,
    color: "#6b7280",
    background: "#f3f4f6",
    border: "1px solid #e5e7eb",
    borderRadius: 20,
    padding: "3px 12px",
  },
  addBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "9px 18px",
    border: "1px solid #d1d5db",
    borderRadius: 8,
    background: "#ffffff",
    fontSize: 14,
    fontWeight: 500,
    color: "#111827",
    cursor: "pointer",
    transition: "all 0.15s",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: 14,
  },
  card: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: "1.25rem",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    cursor: "default",
    transition: "all 0.18s ease",
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  iconEmoji: {
    fontSize: 22,
    lineHeight: 1,
  },
  subjectLabel: {
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "#9ca3af",
    margin: 0,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: 600,
    color: "#111827",
    margin: 0,
  },
  divider: {
    height: 1,
    background: "#f3f4f6",
    margin: "4px 0",
  },
  subjectDesc: {
    fontSize: 13,
    color: "#6b7280",
    lineHeight: 1.55,
    margin: 0,
    flex: 1,
  },
  viewBtn: {
    marginTop: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px 14px",
    border: "1px solid",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.15s",
    width: "100%",
  },
  emptyState: {
    textAlign: "center",
    padding: "4rem 0",
    color: "#9ca3af",
    fontSize: 15,
  },
};

export default SubjectCardGrid;
