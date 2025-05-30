import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  // 订单基本信息
  reference: {
    type: String,
    required: true,
    unique: true,
  }, // 添加用户ID字段
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true, // 添加索引以优化查询
  },
  status: {
    type: String,
    enum: ["pending", "paid", "cancelled"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  // 航班信息
  flightId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Flight",
    required: true,
  },
  flightNumber: {
    type: String,
    required: true,
  },
  departureCity: String,
  arrivalCity: String,
  departureTime: Date,
  arrivalTime: Date,
  departureAirport: String,
  arrivalAirport: String,

  // 价格信息
  price: {
    basePrice: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
  },

  // 乘客信息
  passenger: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },

  // 支付信息
  payment: {
    method: {
      type: String,
      enum: ["credit_card", "debit_card", "bank_transfer"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    transactionId: String,
    paidAt: Date,
  },
});

// 添加索引以提高查询性能
invoiceSchema.index({ reference: 1 });
invoiceSchema.index({ "passenger.email": 1 });
invoiceSchema.index({ createdAt: -1 });

const Invoice = mongoose.model("Invoice", invoiceSchema);

export default Invoice;
