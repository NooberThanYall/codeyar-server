import { Router } from "express";
import authMiddleware from './../middleware/AuthMiddleware.js';
const router = Router();
import User from "../models/UserModel.js";
import adminMiddleware from "../middleware/AdminMiddleware.js";

router.get("/me", authMiddleware, async (req, res, next) => {
  console.log(req.user);
  const { _id } = req.user;
  
  const { fullName, email, languages, subscription } = await User.findById(_id);
  res.status(201).json({ user: { fullName, email, languages } });
});

router.get('/is-admin', adminMiddleware, async (req, res) => {
  res.json({isAdmin: true})
})

router.get('/subscription', authMiddleware, async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id).select('subscription');
    
    if (!user) {
      return res.status(404).json({ message: 'کاربر یافت نشد' });
    }

    const hasActiveSubscription = user.subscription?.endDate && new Date(user.subscription.endDate) > new Date();
    
    res.status(200).json({ hasActiveSubscription });
  } catch (error) {
    console.error('Error in /subscription route:', error);
    res.status(500).json({ message: 'خطایی در سرور رخ داد' });
  }
});

export default router;
