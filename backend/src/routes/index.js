import express from "express";
import {
  getAllFlights,
  getFlightById,
  searchFlights,
} from "../controllers/flightController.js";
import { getRandomUser } from "../controllers/userController.js";
import {
  createBooking,
  getBookingByReference,
  getUserBookings,
  cancelBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

router.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path}`);
  next();
});

router.get("/", (req, res) => {
  res.send("Welcome to the Flight Booking API");
});

// 用户相关接口
router.get("/random-user", getRandomUser);

// 航班相关接口（修复顺序）
router.get("/flights", getAllFlights);
router.get("/flights/search", searchFlights); // 静态路径优先
router.get("/flights/:id", getFlightById); // 动态参数在后

// 订票相关接口
router.post("/bookings", createBooking);
router.get("/bookings/:reference", getBookingByReference);
router.get("/bookings/user/:userId", getUserBookings);
router.post("/bookings/:reference/cancel", cancelBooking);

export default router;
