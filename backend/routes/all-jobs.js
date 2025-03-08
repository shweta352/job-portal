import express from "express";
import Job from "../models/Job.js"; // MongoDB Job model
import authMiddleware from "../middleware/auth.js"; // Ensures user is logged in

const router = express.Router();
router.get("/jobs",authMiddleware,  async (req, res) => {
    try {
      const jobs = await Job.find();
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }); 
  export default router;