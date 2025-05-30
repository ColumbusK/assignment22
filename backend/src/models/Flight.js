import mongoose from "mongoose";
import moment from "moment-timezone";

const flightSchema = new mongoose.Schema({
  flightNumber: {
    type: String,
    required: true,
    unique: true,
  },
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Route",
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  aircraftId: {
    type: String,
    required: true,
  },
  aircraftModel: {
    type: String,
    required: true,
  },
  aircraftImage: {
    type: String,
    required: true,
  },
  routeImage: {
    type: String,
    required: true,
  },
  // 新增：起飞城市（来自机场数据）
  departureCity: {
    type: String,
    required: true,
  },
  // 新增：落地城市（来自机场数据）
  arrivalCity: {
    type: String,
    required: true,
  },
  arrivalAirport: {
    type: String, // icao_code
    required: true,
  },
  departureAirport: {
    type: String, // icao_code
    required: true,
  },
  arrivalAirport: {
    type: String, // icao_code
    required: true,
  },
  // 新增的时区字段
  departureTimezone: {
    type: String,
    required: true,
    validate: {
      validator: (v) => moment.tz.zone(v) !== null,
      message: (props) => `${props.value} is not a valid timezone`,
    },
  },
  arrivalTimezone: {
    type: String,
    required: true,
    validate: {
      validator: (v) => moment.tz.zone(v) !== null,
      message: (props) => `${props.value} is not a valid timezone`,
    },
  },
  departureTime: {
    type: Date,
    required: true,
  },
  arrivalTime: {
    type: Date,
    required: true,
  },
  durationMinutes: {
    type: Number,
    required: true,
  },
  totalSeats: {
    type: Number,
    required: true,
  },
  availableSeats: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ["departure", "return"], // 出发航班还是返程航班
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Flight = mongoose.model("Flight", flightSchema);

export default Flight;
