import { Router } from "express";
import crypto from "crypto";
import authMiddleware from "../../middleware/AuthMiddleware.js";
import Plan from "../../models/subscription/PlanModel.js";
import Transaction from "../../models/subscription/TransactionModel.js";
import User from "../../models/UserModel.js";
import mongoose from "mongoose";

const router = Router();

router.post("/buy", authMiddleware, async (req, res) => {
  try {
    const { productId } = req.body;

    // Validate productId
    if (!productId) {
      return res.status(400).json({ message: "شناسه پلن الزامی است" });
    }

    // Find the plan
    const plan = await Plan.findById(productId);
    if (!plan) {
      return res.status(404).json({ message: "پلن مورد نظر یافت نشد" });
    }
    // Create unique transaction ID
    const tokuni = crypto.randomUUID();

    // Create new transaction
    await Transaction.create({
      user: req.user._id,
      plan: plan._id,
      amount: plan.price,
      status: "pending",
      method: "sandbox",
      transactionId: tokuni, // Store the unique ID
    });

    // Return the frontend payment page URL
    res.status(200).json({
      message: "تراکنش ایجاد شد",
      transactionId: tokuni,
      path: `http://127.0.0.1:3000/payment/${tokuni}`, // Point to Next.js payment page
    });
  } catch (error) {
    console.error("Error in buy route:", error);
    res.status(500).json({ message: "خطایی در سرور رخ داد" });
  }
});

router.post("/verify-payment", authMiddleware, async (req, res) => {
  try {
    // لاگ برای دیباگ
    console.log("User ID from auth:", req.user._id);

    // پیدا کردن تراکنش
    const trx = await Transaction.findOne({
      user: new mongoose.Types.ObjectId(req.user._id),
      status: "pending",
    });

    if (!trx) {
      const allTrx = await Transaction.find({
        user: new mongoose.Types.ObjectId(req.user._id),
      });
      console.log("All transactions for user:", allTrx);
      return res.status(400).json({ message: "تراکنش نامعتبر یا یافت نشد" });
    }

    // آپدیت وضعیت تراکنش
    trx.status = "paid";
    trx.refId = `REF-${Math.floor(100000 + Math.random() * 900000)}`;
    await trx.save();

    // پیدا کردن پلن
    const plan = await Plan.findById(trx.plan);
    if (!plan) {
      return res.status(404).json({ message: "پلن مورد نظر یافت نشد" });
    }

    // لاگ برای چک کردن پلن
    console.log("Plan details:", plan);

    // اعتبارسنجی durationDays
    if (
      !plan.durationDays ||
      isNaN(plan.durationDays) ||
      plan.durationDays <= 0
    ) {
      console.error("Invalid plan durationDays:", plan.durationDays);
      return res.status(400).json({ message: "مدت زمان پلن نامعتبر است" });
    }

    // محاسبه تاریخ‌ها
    const now = new Date();
    console.log("Current date (now):", now);
    console.log("Duration days:", plan.durationDays);

    const end = new Date(
      now.getTime() + plan.durationDays * 24 * 60 * 60 * 1000
    );
    console.log("Calculated end date:", end);

    if (isNaN(end.getTime())) {
      console.error("Invalid end date:", end);
      return res
        .status(400)
        .json({ message: "خطا در محاسبه تاریخ پایان اشتراک" });
    }

    // آپدیت اشتراک کاربر
    await User.findByIdAndUpdate(req.user._id, {
      subscription: {
        plan: plan._id,
        startDate: now,
        endDate: end,
      },
    });

    res.status(200).json({ path: "/buy-plan/success" });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ message: "خطایی در سرور رخ داد" });
  }
});
export default router;
