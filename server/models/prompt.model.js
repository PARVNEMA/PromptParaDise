// models/Prompt.js
import mongoose from "mongoose";

const PromptSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
			maxlength: [
				100,
				"Title cannot exceed 100 characters",
			],
		},
		prompt: {
			type: String,
			required: [true, "Prompt content is required"],
			maxlength: [
				5000,
				"Prompt cannot exceed 5000 characters",
			],
		},
		description: {
			type: String,
			required: true,
			maxlength: [
				500,
				"Description cannot exceed 500 characters",
			],
		},
		imageUrl: {
			type: String,
			validate: {
				validator: function (v) {
					return (
						!v ||
						/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(
							v
						)
					);
				},
				message: "Invalid image URL format",
			},
		},
		tags: [
			{
				type: String,
				trim: true,
				lowercase: true,
			},
		], // Additional filtering beyond categories
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
		bookmarks: [
			{
				// Track who bookmarked this prompt
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		views: {
			type: Number,
			default: 0,
		},
		isPublic: {
			type: Boolean,
			default: true,
		},
		isFeatured: {
			// For admin to feature prompts
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

// Virtual for like count
PromptSchema.virtual("likeCount").get(function () {
	return this.likes ? this.likes.length : 0;
});

// Virtual for bookmark count
PromptSchema.virtual("bookmarkCount").get(function () {
	return this.bookmarks ? this.bookmarks.length : 0;
});

// Index for better query performance
PromptSchema.index({ category: 1, isPublic: 1 });
PromptSchema.index({ creator: 1, isPublic: 1 });
PromptSchema.index({ tags: 1 });
PromptSchema.index({ createdAt: -1 });

// Middleware to update category promptCount when a new prompt is added
PromptSchema.post("save", async function (doc) {
	try {
		// Only increment if this is a new document (not an update)
		if (this.isNew) {
			await mongoose.model("Category").findByIdAndUpdate(
				doc.category,
				{ $inc: { promptCount: 1 } }
			);
		}
	} catch (error) {
		console.error("Error updating category promptCount on save:", error);
	}
});

// Middleware to update category promptCount when a prompt is deleted
PromptSchema.post("remove", async function (doc) {
	try {
		await mongoose.model("Category").findByIdAndUpdate(
			doc.category,
			{ $inc: { promptCount: -1 } }
		);
	} catch (error) {
		console.error("Error updating category promptCount on remove:", error);
	}
});

// Middleware to handle findOneAndDelete and similar operations
PromptSchema.post("findOneAndDelete", async function (doc) {
	try {
		if (doc) {
			await mongoose.model("Category").findByIdAndUpdate(
				doc.category,
				{ $inc: { promptCount: -1 } }
			);
		}
	} catch (error) {
		console.error("Error updating category promptCount on findOneAndDelete:", error);
	}
});

export default mongoose.model("Prompt", PromptSchema);
