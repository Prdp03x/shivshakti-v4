import mongoose from "mongoose";
const { Schema, model } = mongoose;
const schema = new Schema({
  _id: { type: String, default: "main" },
  value: { type: Number, default: 0, min: 0 }
}, { versionKey: false });
export const Counter = mongoose.models.Counter || model("Counter", schema);
