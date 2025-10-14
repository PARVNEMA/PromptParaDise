import { Router } from "express";
import {
	createCategory,
	getAllCategories,
} from "../controllers/category.controller.js";
import upload from "../utils/multer.js";

const router = Router();

router.post("/", upload.single("icon"), createCategory);
router.get("/", getAllCategories);

export default router;
