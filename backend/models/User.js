import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name:{type:String,required:true},
  role: { type: String, enum: ["recruiter", "candidate"], required: true }
});

export default mongoose.model("Users", UserSchema);
