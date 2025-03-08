import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditJob = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("open");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchJob();
  }, []);

  const fetchJob = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/route/jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const job = res.data.find((j) => j._id === id);
      if (!job) {
        setError("Job not found");
        return;
      }
      setTitle(job.title);
      setDescription(job.description);
      setStatus(job.status);
    } catch (err) {
      setError("Failed to load job details");
    }
  };

  const updateJob = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:3000/route/jobs/${id}`,
        { title, description, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/manage-jobs");
    } catch (err) {
      setError("Failed to update job");
    }
  };

  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-5">
      <h2>Edit Job</h2>
      <form onSubmit={updateJob}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Status</label>
          <select className="form-control" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Update Job</button>
      </form>
    </div>
  );
};

export default EditJob;
