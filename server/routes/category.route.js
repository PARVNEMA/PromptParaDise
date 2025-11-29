import { Router } from "express";
import {
	createCategory,
	getAllCategories,
	getCategoryProducts,
} from "../controllers/category.controller.js";
import upload from "../utils/multer.js";
import { authenticateUser } from "../controllers/user.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", upload.single("icon"), createCategory);
router.get("/", getAllCategories);
router.get("/getCategoryPrompts/:id", isAuthenticated, getCategoryProducts);

export default router;
