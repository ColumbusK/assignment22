import mongoose from "mongoose";

const routeSchema = new mongoose.Schema({
  routeName: { type: String, required: true },
  description: { type: String },
  from: { type: String, required: true }, // ICAO code
  to: { type: String, required: true }, // ICAO code
  aircraftId: { type: String, required: true },
  days: [{ type: String }], // 出发日数组，如 ["Monday", "Wednesday"]
  returnDays: [{ type: String }], // 返程日数组
  departTime: { type: String }, // 默认出发时间
  returnTime: { type: String }, // 默认返程时间
  departTimePM: { type: String }, // 仅部分航线使用的下午出发时间
  returnTimePM: { type: String }, // 仅部分航线使用的下午返程时间
  flightTimeMinutes: { type: Number },
  type: { type: String }, // "prestige", "shuttle", "island", etc.
  image: { type: String }, // 航线图片
});

const Route = mongoose.model("Route", routeSchema);

export default Route;
