import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import Application from "../models/Application.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Ensure "uploads" directory exists
const uploadDir = path.join("uploads/");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Setup file upload (Multer)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save resumes in "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Apply for a job
router.post("/apply", authMiddleware, upload.single("resume"), async (req, res) => {
  try {
    console.log("Received application:", req.body); // Debugging
    console.log("Authenticated User:", req.user); // Debugging
    const { jobId, jobTitle,recruiterId, name, email, phone, skills } = req.body;

    if (!jobId || !name) {
      return res.status(400).json({ message: "Job ID and Candidate Name are required!" });
    }

console.log(name,email)
    // Save application to DB (Fixed issue: Added `skills` and `resumeUrl`)
    const application = new Application({
      candidateId: req.user.id, // From authMiddleware
      candidateName: name,
      candidateEmail: email,
      candidatePhone: phone,
      recruiterId,
      skills: skills, // Convert skills to array // Save the resume file path
      jobId,
      title:jobTitle,
      status: "pending",
    });

    console.log("Application Data:", application);
    await application.save();

    res.status(201).json({ message: "Application submitted successfully!", application });
  } catch (error) {
    console.error("Error applying for job:", error.message || error);
    res.status(500).json({ message: error.message || "Server error, please try again." });
  }
});

// Get applications from DB
router.get("/candidate", authMiddleware, async (req, res) => {
  try {
    const applications = await Application.find({ candidateId: req.user.id });
    console.log(req.user);

    res.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Server error, please try again." });
  }
});
router.get("/all", authMiddleware, async (req, res) => {
  try {
    let applications;
    const recruiterId = req.headers.recruiterid; // ✅ Read from headers

    console.log("Recruiter ID:", recruiterId);
    // If recruiter, get all applications
    if (req.user.role === "recruiter") {
      applications = await Application.find({recruiterId: req.user.id});
    } else {
      // If candidate, get only their applications
      applications = await Application.find({ candidateId: req.user.id });
    }

    res.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Server error, please try again." });
  }
});
export default router;
