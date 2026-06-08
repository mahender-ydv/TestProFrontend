import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const AddTestPaper = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { subjectId, subjectName } = location.state || {};

  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [totalMarks, setTotalMarks] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem("token");
      await axios.post(`${process.env.REACT_APP_API_URL}/add/add-paper`, {
        title,
        duration,
        totalMarks,
        subjectId,
      },
        {
          headers: { Authorization: `Bearer ${token}` },
        });
      navigate(-1);
    } catch (error) {
      alert("Failed to add test paper");
      console.error(error);
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Add Test Paper for {subjectName}</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Title</label>
          <input className="form-control" required value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="mb-3">
          <label>Duration (in minutes)</label>
          <input type="number" className="form-control" required value={duration} onChange={(e) => setDuration(e.target.value)} />
        </div>
        <div className="mb-3">
          <label>Total Marks</label>
          <input type="number" className="form-control" required value={totalMarks} onChange={(e) => setTotalMarks(e.target.value)} />
        </div>
        <button className="btn btn-primary">Add Test Paper</button>
      </form>
    </div>
  );
};

export default AddTestPaper;
