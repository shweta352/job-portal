import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:3000/auth/register", formData);
      console.log(res);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="shadow-lg d-flex rounded-4 overflow-hidden" style={{ width: "850px", background: "#fff" }}>
        
        {/* Left Side - Job Search Banner */}
        <div className="d-none d-md-flex flex-column justify-content-center align-items-center text-white p-4" style={{ width: "45%", background: "#003366" }}>
          <h3 className="text-center mb-3">Join Us Today</h3>
          <p className="text-center">Start your career journey with us!</p>
        </div>

        {/* Right Side - Registration Form */}
        <div className="p-5" style={{ width: "55%" }}>
          <h2 className="text-center mb-4">Register</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Role</label>
              <select
                name="role"
                className="form-select"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="candidate">Candidate</option>
                <option value="recruiter">Recruiter</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary w-100">Register</button>
          </form>

          <div className="text-center mt-3">
            <p>Already have an account? <Link to="/" className="text-primary">Login</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
