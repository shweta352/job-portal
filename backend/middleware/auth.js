import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";
dotenv.config();
const authMiddleware = async(req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = decoded;
    const user = await User.findById(decoded.id).select("id name role");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = {
      id: user.id,
      name: user.name,
      role: user.role,
    };
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
