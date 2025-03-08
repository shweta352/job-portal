import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import all_jobs from "./routes/all-jobs.js"
import jobRouter from "./routes/jobRouter.js";
import applicationRoutes from "./routes/application.js";
import resumeparser from "./routes/resumeparser.js"

dotenv.config();
const app = express();
// Ensure "uploads" folder exists
const uploadsDir = path.join("uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use(cors()); // Enable CORS
app.use(express.json()); // Allow JSON data
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use("/uploads", express.static("uploads")); // Serve uploaded resumes
// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/auth", authRoutes);
app.use("/route", jobRouter);
app.use("/candidate",all_jobs)
app.use("/applications", applicationRoutes);
app.use("/resume",resumeparser);

// MonoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
