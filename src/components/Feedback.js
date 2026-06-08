import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa"; // You must install react-icons
import axios from "axios"; // Make sure this is at the top

export default function Feedback() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    rating: 0,
    message: "",
  });

  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRating = (rating) => {
    setFormData({ ...formData, rating });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/feedback`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 201) {
        setSubmitted(true);
        setFormData({ name: "", email: "", rating: 0, message: "" });
      } else {
        alert("Something went wrong. Try again.");
      }
    } catch (err) {
      console.error("❌ Error submitting feedback:", err);
      if (err.response?.data?.error) {
        alert("Error: " + err.response.data.error);
      } else {
        alert("Server error, please try again later.");
      }
    }
  };

  return (
    <div className="container mt-5 pt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Feedback Form</h3>

              {submitted && (
                <div className="alert alert-success" role="alert">
                  Thank you for your feedback!
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Rating</label>
                  <div>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        size={28}
                        style={{ cursor: "pointer", marginRight: "5px" }}
                        color={
                          (hoverRating || formData.rating) >= star
                            ? "#ffc107"
                            : "#e4e5e9"
                        }
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => handleRating(star)}
                      />
                    ))}
                    {formData.rating > 0 && (
                      <span className="ms-2 text-muted">
                        ({formData.rating} / 5)
                      </span>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Message</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-dark"
                    disabled={formData.rating === 0}
                  >
                    Submit Feedback
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
