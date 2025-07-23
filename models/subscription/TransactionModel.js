// models/TransactionModel.ts
import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    plan: { type: mongoose.Schema.Types.ObjectId, ref: "Plan", required: true },
    amount: { type: Number, required: true }, // قیمت پرداخت شده
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    authority: String, // از درگاه مثل زرین‌پال می‌گیری
    refId: String, // کد رهگیری موفق
    method: {
      type: String,
      enum: ["zarinpal", "idpay", "sandbox"],
      default: "sandbox",
    },
  },
  { timestamps: true }
);

const Transaction =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);
export default Transaction;
