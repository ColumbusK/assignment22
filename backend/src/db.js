// src/db.js
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI =
  "mongodb+srv://columbusk:columbusk@cluster0.g8i2ghp.mongodb.net/airline?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
  try {
    console.log("正在连接到 MongoDB Atlas...");
    await mongoose.connect(process.env.MONGODB_URI || MONGO_URI);
    console.log("✅ MongoDB Atlas 已连接");
  } catch (error) {
    console.error("❌ 连接 MongoDB 失败:", error.message);
    process.exit(1); // 退出进程
  }
};

export default connectDB;
