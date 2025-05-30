import Invoice from "../models/Invoice.js";
import Flight from "../models/Flight.js";

// 创建订单
export const createBooking = async (req, res) => {
  try {
    const { userId, flightId, passenger, paymentMethod } = req.body;

    // 检查航班是否存在
    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({ message: "航班不存在" });
    }

    // 检查座位是否还有剩余
    if (flight.availableSeats <= 0) {
      return res.status(400).json({ message: "该航班已无可用座位" });
    }

    // 计算价格（基础价格 + 15% 税费）
    const basePrice = flight.price;
    const tax = basePrice * 0.15;
    const total = basePrice + tax;

    // 创建发票
    const invoice = new Invoice({
      reference: `INV${Date.now()}`,
      userId,
      flightId: flight._id,
      flightNumber: flight.flightNumber,
      departureCity: flight.departureCity,
      arrivalCity: flight.arrivalCity,
      departureTime: flight.departureTime,
      arrivalTime: flight.arrivalTime,
      departureAirport: flight.departureAirport,
      arrivalAirport: flight.arrivalAirport,
      price: {
        basePrice,
        tax,
        total,
      },
      passenger,
      payment: {
        method: paymentMethod || "credit_card",
        status: "pending",
      },
    });

    // 保存订单
    await invoice.save();

    // 更新航班座位数
    await Flight.findByIdAndUpdate(flightId, {
      $inc: { availableSeats: -1 },
    });

    res.status(201).json({
      message: "订票成功",
      invoice,
    });
  } catch (error) {
    console.error("创建订单错误:", error);
    res.status(500).json({
      message: "订单创建失败",
      error: error.message,
    });
  }
};

// 获取订单详情
export const getBookingByReference = async (req, res) => {
  try {
    const { reference } = req.params;
    const invoice = await Invoice.findOne({ reference }).populate("flightId");

    if (!invoice) {
      return res.status(404).json({ message: "订单不存在" });
    }

    res.json(invoice);
  } catch (error) {
    console.error("获取订单错误:", error);
    res.status(500).json({
      message: "获取订单失败",
      error: error.message,
    });
  }
};

// 获取用户订单列表
export const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;

    const bookings = await Invoice.find({ userId })
      .sort({ createdAt: -1 })
      .populate("flightId");

    res.json(bookings);
  } catch (error) {
    console.error("获取用户订单错误:", error);
    res.status(500).json({
      message: "获取订单失败",
      error: error.message,
    });
  }
};

// 取消订单
export const cancelBooking = async (req, res) => {
  try {
    const { reference } = req.params;

    // 查找订单
    const invoice = await Invoice.findOne({ reference });

    if (!invoice) {
      return res.status(404).json({ message: "订单不存在" });
    }

    // 检查订单是否已经取消
    if (invoice.status === "cancelled") {
      return res.status(400).json({ message: "订单已经取消" });
    }

    // 更新订单状态
    invoice.status = "cancelled";
    await invoice.save();

    // 恢复航班座位
    await Flight.findByIdAndUpdate(invoice.flightId, {
      $inc: { availableSeats: 1 },
    });

    res.json({
      message: "订单已取消",
      invoice,
    });
  } catch (error) {
    console.error("取消订单错误:", error);
    res.status(500).json({
      message: "取消订单失败",
      error: error.message,
    });
  }
};
