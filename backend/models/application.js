
import mongoose from "mongoose";
import { type } from "os";

const ApplicationSchema = new mongoose.Schema({
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  candidateName: {
    type: String,
    required: true,
  },
  candidateEmail: {
    type: String,
    required: true,
  },
  candidatePhone: {
    type: String,
    required: true,
  },
  skills: {
    type: [String], // Store skills as an array
    default: ['skils are not parsed'],
  },
  recruiterId:{type:String},
  title:{ type: String, required: true},
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
});

const Application = mongoose.models.Application || mongoose.model("Application", ApplicationSchema);
export default Application;