import { Router } from "express";
import authMiddleware from "../../middleware/AuthMiddleware.js";
import Transaction from "../../models/TransactionModel.js";
import Plan from "../../models/PlanModel.js";
import User from "../../models/UserModel.js";

const router = Router();

router.post("/verify-payment/:token", authMiddleware, async (req, res) => {
  try {
    // Find transaction by token and user ID
    const trx = await Transaction.findOne({
      transactionId: req.params.token,
      user: req.user._id,
      status: "pending",
    });

    if (!trx) {
      return res.status(400).json({ message: "تراکنش نامعتبر یا یافت نشد" });
    }

    // Update transaction status
    trx.status = "paid";
    trx.refId = `REF-${Math.floor(100000 + Math.random() * 900000)}`; // Fake refId for sandbox
    await trx.save();

    // Update user subscription
    const plan = await Plan.findById(trx.plan);
    if (!plan) {
      return res.status(404).json({ message: "پلن مورد نظر یافت نشد" });
    }

    const now = new Date();
    const end = new Date(now.getTime() + plan.duration * 24 * 60 * 60 * 1000);

    await User.findByIdAndUpdate(req.user._id, {
      subscription: {
        planId: plan._id,
        startDate: now,
        endDate: end,
      },
    });

    res.status(200).json({ message: "پرداخت موفق و اشتراک فعال شد!" });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ message: "خطایی در سرور رخ داد" });
  }
});

export default router;
