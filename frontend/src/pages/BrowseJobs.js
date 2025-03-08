import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FiClock, FiBookmark, FiUpload, FiCheckCircle } from "react-icons/fi";

const BrowseJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [parsedResume, setParsedResume] = useState(null);
  const [parsing, setParsing] = useState(false);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role !== "candidate") {
      window.location.href = "/";
      return;
    }
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get("http://localhost:3000/candidate/jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(res.data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = async () => {
    if (!selectedFile) {
      alert("Please select a resume before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", selectedFile);
    setParsing(true);

    try {
      const response = await axios.post("http://localhost:3000/resume/parse-resume", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const extractedText = response.data.text;
      setParsedResume(extractResumeData(extractedText));
      alert("Resume uploaded and parsed successfully!");
    } catch (err) {
      console.error("Error parsing resume:", err);
      alert("Error parsing resume.");
    } finally {
      setParsing(false);
    }
  };

  const handleApply = async (jobId, jobTitle, recruiterId) => {
    if (!parsedResume) {
      alert("Please upload and parse a resume before applying.");
      return;
    }

    try {
      await axios.post("http://localhost:3000/applications/apply", {
        jobId,
        jobTitle,
        recruiterId,
        ...parsedResume,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      alert("Application submitted successfully!");
    } catch (err) {
      console.error("Error submitting application:", err);
      alert("Error submitting application.");
    }
  };

  if (loading) return <p className="text-center">Loading jobs...</p>;

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 text-primary">Browse Available Jobs</h2>
      <div className="row g-4">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div className="col-lg-4 col-md-6" key={job._id}>
              <div className="card job-card shadow-lg border-0 rounded-4">
                <div className="card-body position-relative p-4">
                  <div className="d-flex justify-content-between align-items-start">
                    <h5 className="card-title text-dark fw-bold">{job.title}</h5>
                    <FiBookmark className="text-secondary fs-4" />
                  </div>
                  <p className="text-muted mb-2">XYZ Consulting Solutions</p>
                  <p className="mb-2 d-flex align-items-center text-secondary">
                    <FaMapMarkerAlt className="me-2 text-danger" /> {job.location}
                  </p>
                  <p className="small text-muted d-flex align-items-center">
                    <FiClock className="me-2" /> Posted 4 hrs ago
                  </p>
                  <div className="mt-3">
                    <span className="badge bg-success me-2">Full Time</span>
                    <span className="badge bg-info">Remote</span>
                  </div>
                  {job.status === "open" && (
                    <div className="mt-3">
                      <input
                        type="file"
                        className="form-control mb-2"
                        accept=".pdf,.docx"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                      />
                      <button
                        onClick={handleResumeUpload}
                        className="btn btn-sm btn-outline-primary me-2"
                        disabled={parsing}
                      >
                        {parsing ? <FiUpload className="me-1" /> : <FiCheckCircle className="me-1" />} {parsing ? "Parsing..." : "Upload & Parse"}
                      </button>
                      <button onClick={() => handleApply(job._id, job.title, job.recruiterId)} className="btn btn-sm btn-primary">
                        Apply
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted">No jobs available at the moment.</p>
        )}
      </div>

      {parsedResume && (
        <div className="mt-5 p-4 border rounded bg-light">
          <h4 className="text-primary">Extracted Resume Details</h4>
          <p><strong>Name:</strong> {parsedResume.name || "N/A"}</p>
          <p><strong>Email:</strong> {parsedResume.email || "N/A"}</p>
          <p><strong>Phone:</strong> {parsedResume.phone || "N/A"}</p>
          <p><strong>Skills:</strong> {parsedResume.skills?.join(", ") || "N/A"}</p>
        </div>
      )}
    </div>
  );
};

export default BrowseJobs;

const extractResumeData = (text) => {
  const nameRegex = /(?:Name|Full Name|Candidate Name):?\s*(.*)/i;
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
  const phoneRegex = /(\+?\d{1,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/;
  const skillsRegex = /(?:Skills|Technical Skills):?\s*([\w\s#,]+)/i;

  return {
    name: text.match(nameRegex)?.[1] || "",
    email: text.match(emailRegex)?.[0] || "",
    phone: text.match(phoneRegex)?.[0] || "",
    skills: text.match(skillsRegex)?.[1]?.split(/[\s,]+/) || [],
  };
};
