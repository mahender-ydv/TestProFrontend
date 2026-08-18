import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Filter, RotateCcw, ExternalLink, Code2, Sparkles } from "lucide-react";

export default function ExamsPage() {
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState("");
  const [topicFilter, setTopicFilter] = useState("All");
  const [filteredQuestions, setFilteredQuestions] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/dsa-questions`)
      .then((res) => {
        setQuestions(res.data);
        setFilteredQuestions(res.data);
      })
      .catch((err) => {
        console.error("Error fetching questions:", err);
      });
  }, []);

  useEffect(() => {
    const filtered = questions.filter((q) => {
      const matchesSearch = q.title.toLowerCase().includes(search.toLowerCase());
      const matchesTopic = topicFilter === "All" || q.topic === topicFilter;
      return matchesSearch && matchesTopic;
    });
    setFilteredQuestions(filtered);
  }, [search, topicFilter, questions]);

  const topics = ["All", ...new Set(questions.map((q) => q.topic))];

  const handleResetFilters = () => {
    setSearch("");
    setTopicFilter("All");
  };

  return (
    <div className="container-fluid p-0 animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-main mb-1 d-flex align-items-center gap-2">
            Important DSA & Coding Problems <Code2 size={24} className="text-primary" />
          </h2>
          <p className="text-muted mb-0">Curated LeetCode & Data Structures problem bank for tech interview prep.</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-card p-3 mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-5">
            <div className="position-relative">
              <Search size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
              <input
                type="text"
                className="tp-input ps-5"
                placeholder="Search question title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="col-12 col-sm-6 col-md-4">
            <div className="position-relative">
              <Filter size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
              <select
                className="tp-input ps-5"
                value={topicFilter}
                onChange={(e) => setTopicFilter(e.target.value)}
              >
                {topics.map((topic, index) => (
                  <option key={index} value={topic}>
                    Topic: {topic}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-md-3">
            <button
              className="tp-btn tp-btn-secondary w-100 py-2-5"
              onClick={handleResetFilters}
            >
              <RotateCcw size={16} /> Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="text-muted fs-6">
          Showing <strong className="text-main">{filteredQuestions.length}</strong> problem{filteredQuestions.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Modern Table Container */}
      <div className="glass-card p-0 overflow-hidden shadow-sm">
        <div className="table-responsive">
          <table className="table table-borderless table-hover align-middle mb-0">
            <thead style={{ backgroundColor: "var(--bg-surface-elevated)", borderBottom: "1px solid var(--border-subtle)" }}>
              <tr>
                <th className="py-3 px-4 text-muted fw-semibold fs-7">#</th>
                <th className="py-3 px-4 text-muted fw-semibold fs-7">PROBLEM TITLE</th>
                <th className="py-3 px-4 text-muted fw-semibold fs-7">TOPIC</th>
                <th className="py-3 px-4 text-muted fw-semibold fs-7">DIFFICULTY</th>
                <th className="py-3 px-4 text-muted fw-semibold fs-7 text-end">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuestions.length > 0 ? (
                filteredQuestions.map((q, index) => (
                  <tr key={q._id || index} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                    <td className="py-3 px-4 fw-bold text-muted fs-7">{index + 1}</td>
                    <td className="py-3 px-4 fw-semibold text-main">{q.title}</td>
                    <td className="py-3 px-4">
                      <span className="tp-badge tp-badge-primary">{q.topic}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`tp-badge ${
                          q.difficulty === "Easy"
                            ? "tp-badge-success"
                            : q.difficulty === "Medium"
                            ? "tp-badge-warning"
                            : "tp-badge-danger"
                        }`}
                      >
                        {q.difficulty}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-end">
                      <a
                        href={q.link}
                        target="_blank"
                        rel="noreferrer"
                        className="tp-btn tp-btn-outline py-1-5 px-3 fs-7"
                      >
                        Solve Problem <ExternalLink size={14} />
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    No matching coding questions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
