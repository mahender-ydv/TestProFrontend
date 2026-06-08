import React, { useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";
import axios from "axios";

const SubjectCardGrid = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [role, setRole] = useState(null);

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

  const handleAddSubject = async () => {
    const name = prompt("Enter subject name:");
    const description = prompt("Enter description:");
    if (!name) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/add/add-subject`,
        { name, description },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Subject added successfully!");
      fetchSubjects();
    } catch (err) {
      alert("Error adding subject");
      console.error(err);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/subjects`);

      setSubjects(res.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const handleViewClick = (subject) => {
    console.log("View clicked for:", subject.name);

    navigate("/viewTest", {
      state: { subjectId: subject._id, subjectName: subject.name },
    });
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
      <h2>Subjects</h2>
      {role === "admin" && (
        <div className="mb-3 text-end">
          <button className="btn btn-success" onClick={handleAddSubject}>
            ➕ Add Subject
          </button>
        </div>
      )}
      </div>
      <div className="row g-4">
        {subjects.map((subject, index) => (
          
          <div
            className="col-12 col-sm-6 col-md-4 col-lg-3"
            key={subject._id || index}
          >
         
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{subject.name}</h5>
                <h6 className="card-subtitle mb-2 text-body-secondary">
                  Subject
                </h6>
                <p className="card-text flex-grow-1">
                  {subject.description ||
                    `This is a test paper for ${subject.name}. Click below to view.`}
                </p>
                <button
                  className="btn btn-primary mt-auto"
                  onClick={() => handleViewClick(subject)}
                >
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectCardGrid;
