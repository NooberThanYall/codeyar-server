import { Router } from "express";
const router = Router();
import snippetController from "../controllers/snippetController.js";
import authMiddleware from "./../middleware/AuthMiddleware.js";
import adminMiddleware from "./../middleware/AdminMiddleware.js";

router.get("/", authMiddleware, snippetController.getUserSnippets);

router.get("/:id", authMiddleware, snippetController.getSingleSnippet );

router.get("/community", adminMiddleware, snippetController.getPublicSnippets);

router.post("/", authMiddleware, snippetController.newSnippet);

router.put("/", authMiddleware, snippetController.updateSnippet);

router.put(
  "/publicity-request",
  authMiddleware,
  snippetController.requestSnippetPublicityApprovementByAdmin
);

router.put(
  "/approve-publicity",
  adminMiddleware,
  snippetController.approveSnippetPublicity
);

export default router;
