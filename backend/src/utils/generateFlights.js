// utils/generateFlights.js
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://columbusk:columbusk@cluster0.g8i2ghp.mongodb.net/airline?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

import Route from "../models/Route.js";
import Aircraft from "../models/Aircraft.js";
import Airport from "../models/Airport.js";
import Flight from "../models/Flight.js";
import moment from "moment-timezone";
import calculateFlightPrice from "./price.js";

const generateFlightsFor30Days = async () => {
  const routes = await Route.find();
  const aircrafts = await Aircraft.find();
  const airports = await Airport.find();

  const flights = [];
  const dayNameToNumber = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  for (const route of routes) {
    const fromAirport = airports.find((a) => a.icao_code === route.from);
    const toAirport = airports.find((a) => a.icao_code === route.to);
    const aircraft = aircrafts.find((a) => a.aircraftId === route.aircraftId);

    if (!fromAirport || !toAirport || !aircraft) continue;

    for (let i = 0; i < 30; i++) {
      const baseDate = moment().add(i, "days").startOf("day");

      const createFlight = async (type) => {
        const isDeparture = type === "departure";
        const days = isDeparture ? route.days : route.returnDays;
        const numericDays = (days || []).map((day) => dayNameToNumber[day]);
        const dow = baseDate.day();

        if (!numericDays.includes(dow)) return;

        // 确定出发和到达机场
        const depAirport = isDeparture ? fromAirport : toAirport;
        const arrAirport = isDeparture ? toAirport : fromAirport;

        // 设置本地时间
        const depTimeLocal = baseDate
          .clone()
          .tz(depAirport.timezone)
          .set({
            hour: isDeparture ? 10 : 15,
            minute: 0,
            second: 0,
            millisecond: 0,
          });

        // 转换为UTC时间
        const depTimeUTC = depTimeLocal.clone().utc();

        // 计算到达UTC时间
        const arrTimeUTC = depTimeUTC
          .clone()
          .add(route.flightTimeMinutes, "minutes");

        // 转换为到达机场的本地时间
        const arrTimeLocal = arrTimeUTC.clone().tz(arrAirport.timezone);

        flights.push({
          flightNumber: `FL${Math.floor(1000 + Math.random() * 9000)}`,
          routeId: route._id,
          // 添加价格字段
          price: calculateFlightPrice(route.flightTimeMinutes, aircraft.model),
          aircraftId: aircraft.aircraftId,
          aircraftModel: aircraft.model,
          aircraftImage: aircraft.image,
          routeImage: route.image,
          departureCity: depAirport.name, // 使用机场数据中的name字段
          arrivalCity: arrAirport.name, // 使用机场数据中的name字段
          departureAirport: depAirport.icao_code,
          arrivalAirport: arrAirport.icao_code,
          // 新增时区字段 - 前端可以直接使用
          departureTimezone: depAirport.timezone,
          arrivalTimezone: arrAirport.timezone,
          // 时间字段保持不变（本地时间）
          departureTime: depTimeLocal.toDate(),
          arrivalTime: arrTimeLocal.toDate(),
          durationMinutes: route.flightTimeMinutes,
          totalSeats: aircraft.capacity,
          availableSeats: aircraft.capacity,
          type,
          createdAt: new Date(),
        });
      };

      await createFlight("departure");
      await createFlight("return");
    }
  }

  await Flight.deleteMany({ departureTime: { $gte: new Date() } });
  await Flight.insertMany(flights);
};

generateFlightsFor30Days()
  .then(() => {
    console.log("✅ Flights generated successfully with timezone data");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("❌ Error generating flights:", err);
    mongoose.connection.close();
  });

export default generateFlightsFor30Days;
