import React, { useState, useEffect } from "react";
import axios from "axios";

export default function LeetCodeImportantQuestions() {
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState("");
  const [topicFilter, setTopicFilter] = useState("All");

  const [filteredQuestions, setFilteredQuestions] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/dsa-questions`)
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
    <div className="container mt-4">
      <h2 className="text-center mb-4">Most Important LeetCode Questions</h2>

      {/* Filters */}
      <div className="row mb-3">
        <div className="col-md-4 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search by question title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-4 mb-2">
          <select
            className="form-select"
            value={topicFilter}
            onChange={(e) => setTopicFilter(e.target.value)}
          >
            {topics.map((topic, index) => (
              <option key={index} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4 mb-2">
          <button className="btn btn-outline-secondary w-100" onClick={handleResetFilters}>
            Reset Filters
          </button>
        </div>
      </div>

      {/* Total Found Count */}
      <div className="mb-3">
        <strong>Total Result:</strong> {filteredQuestions.length}{" "}
        {filteredQuestions.length === 1 ? "question" : "questions"}
      </div>

      {/* Table */}
      <div className="table-responsive shadow-sm">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Topic</th>
              <th>Difficulty</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((q, index) => (
                <tr key={q._id || index}>
                  <td>{index + 1}</td>
                  <td>{q.title}</td>
                  <td><span className="badge bg-secondary">{q.topic}</span></td>
                  <td>
                    <span
                      className={
                        "badge " +
                        (q.difficulty === "Easy"
                          ? "bg-success"
                          : q.difficulty === "Medium"
                          ? "bg-warning text-dark"
                          : "bg-danger")
                      }
                    >
                      {q.difficulty}
                    </span>
                  </td>
                  <td>
                    <a
                      href={q.link}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-outline-primary"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No matching questions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

