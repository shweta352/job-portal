import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PostJob = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handlePostJob = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized! Please log in again.");
        return;
      }

      const res = await axios.post(
        "http://localhost:3000/route/jobs",
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Job posted successfully!");
      setTitle("");
      setDescription("");

      // Redirect after success
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      setError("Failed to post job. Try again.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Post a New Job</h2>
      <div className="card p-4 shadow-lg">
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handlePostJob}>
          <div className="mb-3">
            <label className="form-label">Job Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter job title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Job Description</label>
            <textarea
              className="form-control"
              placeholder="Enter job description"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary w-100">Post Job</button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
