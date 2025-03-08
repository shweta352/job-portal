import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("id", res.data.id);

      if (res.data.role === "recruiter") {
        navigate("/dashboard");
      } else {
        navigate("/jobs");
      }
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="shadow-lg d-flex rounded-4 overflow-hidden" style={{ width: "850px", background: "#fff" }}>
        
        {/* Left Side - Job Search Banner */}
        <div className="d-none d-md-flex flex-column justify-content-center align-items-center text-white p-4" style={{ width: "45%", background: "#003366" }}>
          <h3 className="text-center mb-3">Find Your Dream Job</h3>
          <p className="text-center">Start your career journey with us!</p>
        </div>

        {/* Right Side - Login Form */}
        <div className="p-5" style={{ width: "55%" }}>
          <h2 className="text-center mb-4">Login</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">Login</button>
          </form>

          <div className="text-center mt-3">
            <p>New User? <Link to="/register" className="text-primary">Sign Up</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
