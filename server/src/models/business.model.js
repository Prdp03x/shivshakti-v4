import mongoose from "mongoose";
const { Schema, model } = mongoose;
const schema = new Schema({
  name: { type: String, default: "My Business", trim: true },
  address: { type: String, default: "", trim: true },
  phone: { type: String, default: "", trim: true },
  email: { type: String, default: "", trim: true },
  gstNumber: { type: String, default: "", trim: true },
  logoUrl: { type: String, default: "", trim: true },
  billPrefix: { type: String, default: "CM", trim: true },
  nextBillNumber: { type: Number, default: 1, min: 1 }
}, { timestamps: true, versionKey: false });
export const Business = mongoose.models.Business || model("Business", schema);
