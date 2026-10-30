import mongoose from "mongoose";
const { Schema, model } = mongoose;
const itemSchema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 200 },
  qty: { type: Number, required: true, min: 0.001 },
  price: { type: Number, required: true, min: 0 },
  lineTotal: { type: Number, required: true, min: 0 }
}, { _id: false });
const snapshotSchema = new Schema({
  name: { type: String, default: "" }, phone: { type: String, default: "" },
  address: { type: String, default: "" }, email: { type: String, default: "" }
}, { _id: false });
const schema = new Schema({
  billNumber: { type: String, required: true },
  customerId: { type: Schema.Types.ObjectId, ref: "Customer", default: null },
  customerSnapshot: { type: snapshotSchema, default: () => ({}) },
  items: { type: [itemSchema], validate: v => v.length > 0 },
  total: { type: Number, required: true, min: 0 },
  amountPaid: { type: Number, required: true, min: 0 },
  balance: { type: Number, required: true, min: 0 },
  paymentStatus: { type: String, enum: ["Paid", "Partially Paid", "Pending"], required: true },
  notes: { type: String, default: "", maxlength: 1000 }
}, { timestamps: true, versionKey: false });
schema.index({ billNumber: 1 }, { unique: true });
schema.index({ createdAt: -1 });
schema.index({ customerId: 1, createdAt: -1 });
export const Bill = mongoose.models.Bill || model("Bill", schema);
