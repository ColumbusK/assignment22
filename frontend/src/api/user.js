// src/api/user.js
import axios from "axios";

const API_BASE_URL = "/api";
// 获取随机用户
const fetchRandomUser = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/random-user`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch random user:", error);
    throw error;
  }
};

export { fetchRandomUser };
