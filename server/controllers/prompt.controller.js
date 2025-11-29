import {
	deleteMediaFromCloudinary,
	uploadMedia,
} from "../utils/cloudinary.js";
import {
	ApiError,
	catchAsync,
} from "../middleware/error.middleware.js";
import { sendResponse } from "../utils/responsehandler.js";
import promptModel from "../models/prompt.model.js";

export const createPrompt = catchAsync(async (req, res) => {
	const { title, prompt, description, category } = req.body;
	if (!title || !prompt || !description || !category) {
		throw new ApiError("All fields are required", 400);
	}
	const image = req.file;
	let imageUrl;
	if (image) {
		imageUrl = await uploadMedia(image.path);
	}
	const newPrompt = await promptModel.create({
		title,
		prompt,
		description,
		category,
		imageUrl: imageUrl?.secure_url,
		creator: req.id,
	});

	if (!newPrompt) {
		if (imageUrl) {
			await deleteMediaFromCloudinary(imageUrl.public_id);
		}
		throw new ApiError("Prompt not created", 500);
	}

	sendResponse(
		res,
		201,
		true,
		"Prompt created successfully",
		newPrompt
	);
});
export const getAllPrompts = catchAsync(
	async (req, res) => {
		const search = req.query.search || "";
		const index = parseInt(req.query.index) || 0;
		const top = parseInt(req.query.top) || 10;

		const prompts = await promptModel
			.find({
				$or: [
					{ title: { $regex: search, $options: "i" } },
					{ prompt: { $regex: search, $options: "i" } },
					{
						description: { $regex: search, $options: "i" },
					},
				],
			})
			.skip(index)
			.limit(top);

		if (prompts.length === 0) {
			throw new ApiError("No prompts found", 404);
		}

		sendResponse(
			res,
			200,
			true,
			"Prompts retrieved successfully",
			prompts
		);
	}
);
export const getAllUserPrompts = catchAsync(
	async (req, res) => {
		const index = parseInt(req.query.index) || 0;
		const top = parseInt(req.query.top) || 10;

		const prompts = await promptModel
			.find({
				creator: req.id,
			})
			.skip(index)
			.limit(top);

		if (prompts.length === 0) {
			throw new ApiError(
				"No prompts found for the user",
				404
			);
		}

		sendResponse(
			res,
			200,
			true,
			"Prompts for user retrieved successfully",
			prompts
		);
	}
);
