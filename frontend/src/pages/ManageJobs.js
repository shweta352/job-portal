import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(res.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load jobs");
      setLoading(false);
    }
  };

  const deleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await axios.delete(`http://localhost:5000/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(jobs.filter((job) => job._id !== id));
    } catch (err) {
      alert("Error deleting job");
    }
  };

  if (loading) return <p>Loading jobs...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-5">
      <h2 className="text-center">Manage Job Listings</h2>
      <Link to="/post-job" className="btn btn-success mb-3">Post New Job</Link>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job._id}>
                <td>{job.title}</td>
                <td>{job.description}</td>
                <td>{job.status}</td>
                <td>
                  <Link to={`/edit-job/${job._id}`} className="btn btn-warning btn-sm mx-1">Edit</Link>
                  <button onClick={() => deleteJob(job._id)} className="btn btn-danger btn-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageJobs;
