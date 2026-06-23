import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaPencilAlt, FaUser } from "react-icons/fa";

export default function Setting() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null)
  const [profilePic, setProfilePic] = useState(null);

  const handleIconClick = () => {
    fileInputRef.current.click();

  }

  const handleImageChange = async (e) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    const file = e.target.files[0];
    if (!file) return;
    console.log(file);

    const formData = new FormData()

    formData.append("profile", file)

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/update-profile-pic`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          }
        }
      )
      setProfilePic(res.data.imageUrl);
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

    } catch (error) {
      console.log(error)
    }


  }


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setProfilePic(user.profilePic)
    }
  }, []);

  const updateName = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/update-profile`,
        {
          name,
          email: user.email, // Send email as expected by backend
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach JWT token
          },
        }
      );

      if (res.data.success) {
        // Update localStorage with new name
        localStorage.setItem("user", JSON.stringify({ ...user, name }));
        setMessage("Name updated successfully!");
      } else {
        setMessage("Failed to update name.");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Error updating name.");
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword)
      return setMessage("Please enter both old and new password.");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/change-password`,
        {
          oldPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(res.data.message);
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Password change failed.");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("Are you sure you want to delete your account? This action is irreversible.");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${process.env.REACT_APP_API_URL}/auth/delete-account`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Clear local storage and redirect
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("email");
      // localStorage.removeItem("resetEmail");
      navigate("/signup");
    } catch (err) {
      alert("Failed to delete account. Please try again.");
    }
  };


  return (
    <div className="container mt-4">
      <h3 className="mb-4">Settings</h3>
      {message && <div className="alert alert-info">{message}</div>}

      <div className="d-flex flex-column align-items-center mb-4">
        <div className="position-relative ">
          <img
            src={profilePic}
            alt="user"
            className="rounded-circle shadow"
            width="120"
            height="120"
            style={{ objectFit: "cover" }}
          />

          <FaPencilAlt onClick={handleIconClick}
            className="position-absolute bottom-0 end-0 bg-light p-2 rounded-circle shadow"
            style={{ cursor: "pointer" }}
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            hidden
          />
        </div>
      </div>

      {/* Update Name */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header">Update Profile</div>
        <div className="card-body">
          <form onSubmit={updateName}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email Address (readonly)</label>
              <input
                type="email"
                className="form-control"
                value={email}
                disabled
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Update Name
            </button>
          </form>
        </div>
      </div>

      {/* Change Password */}
      <div className="card shadow-sm">
        <div className="card-header">Change Password</div>
        <div className="card-body">
          <form onSubmit={changePassword}>
            <div className="mb-3">
              <label className="form-label">Old Password</label>
              <input
                type="password"
                className="form-control"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-warning">
              Change Password
            </button>
          </form>
        </div>
      </div>
      <button
        className="btn btn-danger m-3"

        onClick={handleDeleteAccount}
      >
        Delete My Account
      </button>


    </div>
  );
}
