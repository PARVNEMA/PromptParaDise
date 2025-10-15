import { Router } from "express";

import upload from "../utils/multer.js";
import { createPrompt } from "../controllers/prompt.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = Router();

router.post(
	"/",
	isAuthenticated,
	upload.single("image"),
	createPrompt
);

export default router;
