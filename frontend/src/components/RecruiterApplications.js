import React, { useState, useEffect } from "react";
import axios from "axios";

const RecruiterApplications = () => {
  const [applications, setApplications] = useState([]);
  const token = localStorage.getItem("token");
  const recruiterId=localStorage.getItem("id");
console.log(recruiterId)
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/applications/all`,{
        headers: { Authorization: `Bearer ${token}` },
        RecruiterId: recruiterId,  // ✅ Send recruiterId in headers
      });
      setApplications(res.data);
    } catch (err) {
      console.error("Error fetching applications:", err);
    }
  };
  return (
    <div className="container mt-4">
      <h2>Job Applications</h2>
      <div className="row">
        {applications.length > 0 ? (
          applications.map((app) => (
            <div key={app._id} className="col-md-4 col-sm-6 mb-3">
              <div className="card p-3 shadow-sm">
                <h5>{app.candidateName}</h5>
                <p>Email: {app.candidateEmail }</p>
                <p>Job ID: {app.jobId}{console.log(applications)}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No applications yet.</p>
        )}
      </div>
    </div>
  );
};

export default RecruiterApplications;
