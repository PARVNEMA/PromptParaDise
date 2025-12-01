import { Router } from "express";

import upload from "../utils/multer.js";
import { createPrompt, getAllPrompts, getAllUserPrompts, getPromptById, toggleBookmark, toggleLike, getUserLikes } from "../controllers/prompt.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = Router();
router.use(isAuthenticated);
router.post("/", upload.single("image"), createPrompt);
router.get("/", getAllPrompts);
router.get("/userPrompts", getAllUserPrompts);
router.get("/userLikes", getUserLikes);
router.get("/getprompt/:id", getPromptById);
router.post("/toggleLike/:id", toggleLike);
router.post("/toggleBookmark/:id", toggleBookmark);
export default router;
