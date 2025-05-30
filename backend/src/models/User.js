// src/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  gender: { type: String, enum: ["male", "female"], required: true },
  title: { type: String, enum: ["Mr", "Miss", "Mrs"], required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  created_at: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

export default User;
