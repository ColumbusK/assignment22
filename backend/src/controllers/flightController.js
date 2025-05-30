import Flight from "../models/Flight.js";
import moment from "moment-timezone";

export const searchFlights = async (req, res) => {
  try {
    const { from, to, date } = req.query;

    // 验证参数
    if (!from || !to || !date) {
      return res.status(400).json({
        error: "Missing required parameters: from, to, or date",
      });
    }

    // 验证日期格式
    if (!moment(date, "YYYY-MM-DD", true).isValid()) {
      return res.status(400).json({
        error: "Invalid date format. Please use YYYY-MM-DD",
      });
    }

    // 计算日期范围（UTC时间）
    const startOfDay = moment.utc(date).startOf("day").toDate();
    const endOfDay = moment.utc(date).endOf("day").toDate();

    // 查询数据库
    const flights = await Flight.find({
      departureAirport: from,
      arrivalAirport: to,
      departureTime: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }).sort({ departureTime: 1 }); // 按起飞时间升序排序

    res.json(flights);
  } catch (error) {
    console.error("Error searching flights:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllFlights = async (req, res) => {
  try {
    // 从MongoDB获取所有航班
    const flights = await Flight.find({})
      .sort({ departureTime: 1 }) // 默认按起飞时间升序排序
      .limit(1000); // 限制最大返回1000条记录防止性能问题

    // 返回成功响应
    res.status(200).json(flights);
  } catch (error) {
    // 错误处理
    console.error("Error fetching flights:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch flights",
      error: error.message,
    });
  }
};

/**
 * 根据ID获取单个航班详情
 */
export const getFlightById = async (req, res) => {
  try {
    // 从路由参数获取航班ID
    const flightId = req.params.id;
    console.log(`Fetching flight with ID: ${flightId}`);

    // 从MongoDB查询航班
    const flight = await Flight.findById(flightId);

    // 如果航班不存在
    if (!flight) {
      return res.status(404).json({
        success: false,
        message: `Flight with ID ${flightId} not found`,
      });
    }

    // 返回成功响应
    res.status(200).json(flight);
  } catch (error) {
    // 错误处理
    console.error(`Error fetching flight with ID ${req.params.id}:`, error);

    // 处理无效ID格式
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid flight ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch flight",
      error: error.message,
    });
  }
};
