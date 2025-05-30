import mongoose from "mongoose";

const aircraftSchema = new mongoose.Schema({
  aircraftId: { type: String, required: true, unique: true },
  model: { type: String, required: true },
  capacity: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, required: true },
});

const Aircraft = mongoose.model("Aircraft", aircraftSchema);

export default Aircraft;
