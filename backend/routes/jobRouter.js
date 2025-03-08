import express from "express";
import Job from "../models/Job.js"; // MongoDB Job model
import authMiddleware from "../middleware/auth.js";
import Application from "../models/application.js"; // Ensures user is logged in

const router = express.Router();

// POST a new job (Recruiter only)
router.post("/jobs", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ message: "Only recruiters can post jobs" });
    }
    const { title, description } = req.body;
    const newJob = new Job({ title, description, status: "open", recruiterId: req.user.id });

    await newJob.save();
    res.status(201).json({ message: "Job posted successfully", job: newJob });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});
router.get("/jobs", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ message: "Only recruiters can view jobs" });
    }

    const jobs = await Job.find({ recruiterId: req.user.id });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update a job post (Recruiter Only)
router.put("/jobs/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const job = await Job.findOne({ _id: req.params.id, recruiterId: req.user.id });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    job.title = req.body.title || job.title;
    job.description = req.body.description || job.description;
    job.status = req.body.status || job.status;

    await job.save();
    res.json({ message: "Job updated successfully", job });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
// ✅ Delete a job post (Recruiter Only)
router.delete("/jobs/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const job = await Job.findOne({ _id: req.params.id, recruiterId: req.user.id });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    await job.deleteOne();
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/recruiter/applications", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ message: "Access denied" });
    }

    const recruiterJobs = await Job.find({ postedBy: req.user.id }); // Get jobs posted by the recruiter
    const jobIds = recruiterJobs.map((job) => job._id); // Get job IDs

    const applications = await Application.find({ jobId: { $in: jobIds } }).populate("candidateId", "name email");
    res.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "recruiter") return res.status(403).json({ message: "Access denied" });

    const { status } = req.body;
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: "Application not found" });

    application.status = status;
    await application.save();
    res.json({ message: `Application ${status} successfully!` });
  } catch (error) {
    console.error("Error updating application:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
