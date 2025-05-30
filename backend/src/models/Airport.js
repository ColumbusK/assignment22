import mongoose from "mongoose";

const airportSchema = new mongoose.Schema({
  name: { type: String, required: true },
  airport_name: { type: String, required: true },
  icao_code: { type: String, required: true, unique: true },
  country: { type: String, required: true },
  timezone: { type: String, required: true },
});

const Airport = mongoose.model("Airport", airportSchema);

export default Airport;
