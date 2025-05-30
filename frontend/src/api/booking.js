import axios from "axios";

const API_BASE_URL = "/api";
// 创建机票预订
export const createBooking = async (bookingData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/bookings`, bookingData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "预订失败，请稍后重试");
  }
};

// 根据订单号获取预订详情
export const getBookingByReference = async (reference) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/bookings/${reference}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "获取订单信息失败");
  }
};

// 构造预订数据的辅助函数
export const prepareBookingData = (
  flight,
  passenger,
  paymentMethod = "credit_card"
) => {
  return {
    flightId: flight._id,
    passenger: {
      name: passenger.name,
      email: passenger.email,
      phone: passenger.phone,
    },
    paymentMethod,
  };
};

// 获取用户历史订单
export const getUserBookings = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/bookings/user/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch bookings"
    );
  }
};

// 取消订单
export const cancelBooking = async (reference) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/bookings/${reference}/cancel`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to cancel booking"
    );
  }
};
