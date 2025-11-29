import { Router } from "express";

import upload from "../utils/multer.js";
import { createPrompt, getAllPrompts, getAllUserPrompts } from "../controllers/prompt.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = Router();
router.use(isAuthenticated);
router.post("/", upload.single("image"), createPrompt);
router.get("/", getAllPrompts);
router.get("/userPrompts", getAllUserPrompts);

export default router;
