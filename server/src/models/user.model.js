import mongoose from "mongoose";
const { Schema, model } = mongoose;
const schema = new Schema({
  username: { type: String, required: true, unique: true, trim: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["admin"], default: "admin" },
  active: { type: Boolean, default: true },
  lastLoginAt: { type: Date, default: null }
}, { timestamps: true, versionKey: false });
export const User = mongoose.models.User || model("User", schema);
