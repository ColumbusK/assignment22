import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./db.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(path.dirname(__filename));

const app = express();

// 基础中间件 - 配置 CORS
app.use(
  cors({
    origin: "*", // 允许所有来源
  })
);
app.use(express.json());

// 初始化数据库连接
connectDB();

// API 路由
app.use("/api", routes);

// 静态文件服务（前端资源）
app.use(express.static(path.join(__dirname, "public")));

// SPA 回退路由 - 简化版
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 8000;
// 关键修改：绑定到 0.0.0.0
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
