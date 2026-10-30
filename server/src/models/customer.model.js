import mongoose from "mongoose";
const { Schema, model } = mongoose;
const schema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 160 },
  phone: { type: String, default: "", trim: true, maxlength: 30 },
  address: { type: String, default: "", trim: true, maxlength: 500 },
  email: { type: String, default: "", trim: true, maxlength: 200 }
}, { timestamps: true, versionKey: false });
schema.index({ phone: 1 });
export const Customer = mongoose.models.Customer || model("Customer", schema);
