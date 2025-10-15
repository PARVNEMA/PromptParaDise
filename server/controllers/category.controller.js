import {
	ApiError,
	catchAsync,
} from "../middleware/error.middleware.js";

import Category from "../models/category.model.js";
import promptModel from "../models/prompt.model.js";
import {
	deleteMediaFromCloudinary,
	uploadMedia,
} from "../utils/cloudinary.js";
import { sendResponse } from "../utils/responsehandler.js";

export const createCategory = catchAsync(
	async (req, res) => {
		const { name, description, color } = req.body;
		const icon = req.file;

		if (!name || !description) {
			throw new ApiError("All fields are required", 400);
		}
		if (!req.file) {
			throw new ApiError("Icon is required", 400);
		}

		const image = await uploadMedia(icon.path);

		const newCategory = await Category.create({
			name,
			description,
			color,
			icon: image.secure_url,
		});
		if (!newCategory) {
			await deleteMediaFromCloudinary(image.public_id);
			throw new ApiError("Category creation failed", 500);
		}
		sendResponse(
			res,
			201,
			true,
			"Category created",
			newCategory
		);
	}
);

export const getAllCategories = catchAsync(
	async (req, res) => {
		const categories = await Category.find({
			isActive: true,
		}).sort({ createdAt: -1 });

		sendResponse(
			res,
			200,
			true,
			"Categories fetched",
			categories
		);
	}
);

export const getCategoryProducts = catchAsync(
	async (req, res) => {
		const { id } = req.params;
		if (!id) {
			throw new ApiError("Category id is required", 400);
		}
		const category = await Category.findById(id);
		if (!category) {
			throw new ApiError("Category not found", 404);
		}
		const products = await promptModel.find({
			category: id,
		});
		if (!products) {
			throw new ApiError(
				"No products found for this category",
				404
			);
		}
		sendResponse(
			res,
			200,
			true,
			"Products fetched",
			products
		);
	}
);
