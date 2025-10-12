// models/Prompt.js
import mongoose from "mongoose";
import { type } from "server/reply";

const PromptSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		prompt: {
			type: String,
			required: [true, "prompt is required"],
		},
		description: {
			type: String,
			required: true,
		},
		imageUrl: {
			type: String,
		},
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Category",
			required: true,
		},
		creator: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		isPublic: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

export default mongoose.model("Prompt", PromptSchema);
