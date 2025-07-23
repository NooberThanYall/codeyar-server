// models/PlanModel.ts
import mongoose from "mongoose";

const PlanSchema = new mongoose.Schema({
  name: { type: String, required: true, enum: ['basic', 'pro'],
    default: "basic", }, 
  price: { type: Number, required: true }, // قیمت به تومان
  durationDays: { type: Number, required: true }, // مثلا 30 برای ماهانه
  features: [String], // امکانات هر پلن
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Plan = mongoose.models.Plan || mongoose.model("Plan", PlanSchema);
export default Plan;
