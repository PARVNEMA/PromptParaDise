// models/Category.js
import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			maxlength: [
				50,
				"Category name cannot exceed 50 characters",
			],
		},
		slug: {
			type: String,
			unique: true,
			lowercase: true,
			trim: true,
		},
		description: {
			type: String,
			maxlength: [
				200,
				"Description cannot exceed 200 characters",
			],
		},
		icon: {
			type: String, // For category icons in UI
		},
		color: {
			type: String, // Hex color for category theming
			default: "#6366f1",
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		promptCount: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true }
);

// Pre-save middleware to generate slug
CategorySchema.pre("save", function (next) {
	if (this.isModified("name")) {
		this.slug = this.name
			.toLowerCase()
			.replace(/[^a-z0-9]/g, "-")
			.replace(/-+/g, "-");
	}
	next();
});

export default mongoose.model("Category", CategorySchema);
