// src/controllers/userController.js
import User from "../models/User.js"; // 确保你已经创建了 User 模型

export const getRandomUser = async (req, res) => {
  try {
    const count = await User.countDocuments();
    const randomIndex = Math.floor(Math.random() * count);
    const user = await User.findOne().skip(randomIndex).lean();

    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching random user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
