import mongoose from "mongoose";
import { Business, Counter } from "../models/index.js";

export async function connectDatabase(uri) {
  await mongoose.connect(uri);
  if (!(await Business.findOne())) await Business.create({});
  await Counter.updateOne({ _id: "main" }, { $setOnInsert: { value: 0 } }, { upsert: true });
}
