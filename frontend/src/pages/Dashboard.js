import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import RecruiterApplications from "../components/RecruiterApplications";

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role !== "recruiter") {
      window.location.href = "/";
      return;
    }
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get("http://localhost:3000/route/jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setLoading(false);
    }
  };

  const deleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await axios.delete(`http://localhost:3000/route/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(jobs.filter((job) => job._id !== id));
    } catch (err) {
      alert("Error deleting job");
    }
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      <div className="row">
        {/* Sidebar */}
        <nav className="col-md-3 col-lg-2 d-md-block bg-dark sidebar shadow-sm p-3 text-white">
          <h4 className="text-center">Dashboard</h4>
          <ul className="nav flex-column mt-4">
            <li className="nav-item mb-2">
              <Link to="/post-job" className="nav-link text-white">Post New Job</Link>
            </li>
            <li className="nav-item">
              <Link to="/applications" className="nav-link text-white">View Applications</Link>
            </li>
          </ul>
        </nav>

        {/* Main Content */}
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <h2 className="text-center my-4">Recruiter Dashboard</h2>

          <div className="card p-3 shadow-sm">
            <h4>Your Posted Jobs</h4>
            <div className="row">
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <div className="col-md-4 col-sm-6 mb-4" key={job._id}>
                    <div className="card shadow-sm border-0 rounded-3">
                      <div className="card-body position-relative">
                        <h5 className="card-title text-primary">{job.title}</h5>
                        <p className="text-muted small">{job.description.substring(0, 100)}...</p>
                        <span className={`badge ${job.status === "open" ? "bg-success" : "bg-danger"}`}>{job.status.toUpperCase()}</span>
                        <div className="mt-3 d-flex gap-2">
                          <Link to={`/edit-job/${job._id}`} className="btn btn-outline-primary btn-sm">Edit</Link>
                          <button onClick={() => deleteJob(job._id)} className="btn btn-outline-danger btn-sm">Delete</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted">No jobs posted yet.</p>
              )}
            </div>
          </div>

          <div className="card p-3 shadow-sm mt-4">
            <h3 className="text-center">Job Applications</h3>
            <RecruiterApplications />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
