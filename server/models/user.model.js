import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { type } from "os";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "name is required"],
			trim: true,
			maxLength: [
				50,
				"name must be less than 50 characters",
			],
		},
		email: {
			type: String,
			required: [true, "email is required"],
			unique: true,
			match: [
				/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
				"please provide a valid email",
			],
		},
		password: {
			type: String,
			required: [true, "password is required"],
			minLength: [6, "minlength should be 6"],
			select: false, // *password will not automatically selected and sent when we query the database select(-password)
		},

		avatar: {
			type: String,
			default: "default-avatar.png",
		},

		bio: {
			type: String,
			maxLength: [
				200,
				"bio must be less than 200 characters",
			],
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

// * ismodified checks if the password field is changed or not and it also returns true on first time saving the password

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		return next();
	}
	this.password = await bcrypt.hash(this.password, 10);
	next();
});

// todo compare password
userSchema.methods.comparePassword = async function (
	enteredPassword
) {
	return await bcrypt.compare(
		enteredPassword,
		this.password
	);
};

export const User = mongoose.model("User", userSchema);
