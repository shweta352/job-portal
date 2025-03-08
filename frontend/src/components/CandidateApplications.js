import React, { useState, useEffect } from "react";
import axios from "axios";

const CandidateApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get("http://localhost:3000/applications/candidate", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching applications:", err);
      setLoading(false);
    }
  };

  if (loading) return <p>Loading applications...</p>;

  return (
    <div className="container mt-4">
      <h3 className="text-center">Your Job Applications</h3>
      {applications.length > 0 ? (
        <table className="table table-bordered mt-3">
          <thead className="table-dark">
            <tr>
              <th>Job Title</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id}>
                <td>{app.title || "Job Removed"}</td>
                <td>{console.log(applications)}
                  <span className={`badge ${app.status === "accepted" ? "bg-success" : app.status === "rejected" ? "bg-danger" : "bg-warning"}`}>
                    {app.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No applications submitted yet.</p>
      )}
    </div>
  );
};

export default CandidateApplications;
