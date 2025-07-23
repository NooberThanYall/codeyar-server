import { Router } from "express";
import authMiddleware from "../../middleware/AuthMiddleware.js";
import Snippet from "../../models/SnippetModel.js";
const router = Router();

router.get("/", authMiddleware, async (req, res) => {
  const { _id } = req.user;

  const snippetsCount = await Snippet.countDocuments({ owner: _id });

  res
    .status(200)
    .json([
      {
        value: snippetsCount,
        title: "قطعه کد های ذخیره شده",
        color: "bg-red-500",
      },
    ]); //{ title: "قطعه کدهای ذخیره شده", value: "247", change: "+12%", color: "bg-red-500" }
});

export default router;
