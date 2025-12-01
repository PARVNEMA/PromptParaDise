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
	console.log("createPrompt headers content-type:", req.headers['content-type']);
	console.log("createPrompt body:", req.body);
	console.log("createPrompt file:", req.file);
	const { title, prompt, description, category } = req.body;
	if (!title || !prompt || !description || !category) {
		throw new ApiError("All fields are required", 400);
	}
	const image = req.file;
	let imageUrl;
	if (image) {
		console.log("Attempting to upload image to Cloudinary...");
		imageUrl = await uploadMedia(image.path);
		console.log("Cloudinary upload result:", imageUrl);
	} else {
		console.log("No image file received in req.file");
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
			.limit(top)
			.select("-tags");

		if (prompts.length === 0) {
			sendResponse(
				res,
				404,
				true,
				"No prompts found",
				[]
			);
			return;
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
			.limit(top)
			.select("-tags");

		if (prompts.length === 0) {
			sendResponse(
				res,
				404,
				true,
				"No prompts found for the user",
				[]
			);
			return;
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

export const getPromptById = catchAsync(async (req, res) => {
	const { id } = req.params;
	if(!id){
		throw new ApiError(" prompt id not found", 400);
	}
	const prompt = await promptModel.findById(id).select("-tags");
	if (!prompt) {
		sendResponse(res, 404, true, "Prompt not found");
		return;
	}
	sendResponse(res, 200, true, "Prompt retrieved successfully", prompt);
});

export const toggleLike = catchAsync(async (req, res) => {
	const { id } = req.params;
	if (!id) {
		throw new ApiError("Prompt id not found", 400);
	}
	const prompt = await promptModel.findById(id);
	if (!prompt) {
		sendResponse(res, 404, true, "Prompt not found");
		return;
	}
	if (prompt.likes.some(id => id.toString() === req.id)) {
		prompt.likes = prompt.likes.filter(
			(id) => id.toString() !== req.id
		);
	} else {
		prompt.likes.push(req.id);
	}
	await prompt.save();

	// Return updated prompt with counts
	const updatedPrompt = await promptModel.findById(id).select("-tags");
	sendResponse(res, 200, true, "Like toggled successfully", {
		likeCount: updatedPrompt.likeCount,
		bookmarkCount: updatedPrompt.bookmarkCount,
		isLiked: updatedPrompt.likes.some(id => id.toString() === req.id)
	});
});
export const toggleBookmark = catchAsync(async (req, res) => {
	const { id } = req.params;
	if (!id) {
		throw new ApiError("Prompt id not found", 400);
	}
	const prompt = await promptModel.findById(id);
	if (!prompt) {
		sendResponse(res, 404, true, "Prompt not found");
		return;
	}
	if (prompt.bookmarks.some(id => id.toString() === req.id)) {
		prompt.bookmarks = prompt.bookmarks.filter(
			(id) => id.toString() !== req.id
		);
	} else {
		prompt.bookmarks.push(req.id);
	}
	await prompt.save();

	// Return updated prompt with counts
	const updatedPrompt = await promptModel.findById(id).select("-tags");
	sendResponse(res, 200, true, "Bookmark toggled successfully", {
		likeCount: updatedPrompt.likeCount,
		bookmarkCount: updatedPrompt.bookmarkCount,
		isBookmarked: updatedPrompt.bookmarks.some(id => id.toString() === req.id)
	});
});

export const getUserLikes = catchAsync(async (req, res) => {
	const prompts = await promptModel.find({
		likes: { $in: [req.id] }
	}).select("-tags");

	if (prompts.length === 0) {
		sendResponse(res, 404, true, "No liked prompts found", []);
		return;
	}

	sendResponse(res, 200, true, "Liked prompts retrieved successfully", prompts);
});
