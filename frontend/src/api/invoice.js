export const createInvoice = async (bookingData) => {
  const flight = await Flight.findById(bookingData.flightId);
  if (!flight) {
    throw new Error("Flight not found");
  }

  const invoice = new Invoice({
    reference: `INV${Date.now()}`,
    userId: bookingData.userId, // 添加用户ID
    flightId: flight._id,
    // ...existing code...
  });

  await invoice.save();
  return invoice;
};

// 添加获取用户订单历史的函数
export const getUserInvoices = async (userId) => {
  return await Invoice.find({ userId })
    .sort({ createdAt: -1 })
    .populate("flightId");
};
