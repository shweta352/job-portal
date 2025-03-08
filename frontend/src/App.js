import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import PostJob from "./pages/PostJob";
import Editjob from "./pages/EditJob";
import BrowseJobs from "./pages/BrowseJobs";
import CandidateDashboard from "./pages/CandidateDashboard";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/post-job" element={<PostJob />} />
        <Route path="/edit-job/:id" element={<Editjob />} />
        <Route path="/jobs" element={<BrowseJobs />} />
        <Route path="/candidateDashboard" element={<CandidateDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
