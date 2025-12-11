import {
	ApiError,
	catchAsync,
} from "../middleware/error.middleware.js";
import promptModel from "../models/prompt.model.js";
import { User } from "../models/user.model.js";
import {
	deleteMediaFromCloudinary,
	uploadMedia,
} from "../utils/cloudinary.js";
import { generateToken } from "../utils/generateToken.js";
import { sendResponse } from "../utils/responsehandler.js";

export const createUserAccount = catchAsync(
	async (req, res) => {
		const { name, email, password } = req.body;
		console.log("Request body:", req.body);

		// we will do validaitons globally

		const existingUser = await User.findOne({
			email: email.toLowerCase(),
		});

		if (existingUser) {
			throw new ApiError("user already exists", 400);
		}

		const image = req.file;
		console.log("image", image);

			let imageUrl;
			if (image) {
				console.log("Attempting to upload image to Cloudinary...");
				imageUrl = await uploadMedia(image.path);
				console.log("Cloudinary upload result:", imageUrl);
			} else {
				console.log("No image file received in req.file");
			}

		const user = await User.create({
			name,
			email: email.toLowerCase(),
			password,
			avatar: imageUrl?.secure_url,
		});

		generateToken(res, user, "account created hogya");
	}
);

export const authenticateUser = catchAsync(
	async (req, res) => {
		const { email, password } = req.body;

		// we will do validaitons globally

		const existingUser = await User.findOne({
			email: email.toLowerCase(),
		}).select("+password");

		if (!existingUser) {
			throw new ApiError("user not exists", 400);
		}

		if (!(await existingUser.comparePassword(password))) {
			throw new ApiError("invalid  password", 401);
		}

		generateToken(
			res,
			existingUser,
			`welcome back ${existingUser.name} `
		);
	}
);

export const SignoutUser = catchAsync(async (_, res) => {
	res.cookie("token", "", { maxAge: 0 });

	res.status(200).json({
		success: true,
		message: "signed out successfully 🥲🥲",
	});
});

export const getCurrentUserProfile = catchAsync(
	async (req, res) => {
		const user = await User.findById(req.id)
			.populate({
				path: "enrolledCourses.course",
				select: "title thumbnail description",
			})
			.populate({
				path: "createdCourses",
				select: "title thumbnail description",
			});

		if (!user) {
			throw new ApiError("user not found", 404);
		}

		res.status(200).json({
			success: true,
			data: {
				user,
				// totalenrolledcourses: user.totalenrolledcourses,
			},
		});
	}
);
export const updateUserProfile = catchAsync(
	async (req, res) => {
		const { name, email, bio } = req.body;
		const updateData = {
			name,
			email: email?.toLowerCase(),
			bio,
		};
		console.log("req.file", req.file);
		if (req.file) {
			const avatarResult = await uploadMedia(req.file.path);
			// console.log("avatar result", avatarResult);
			updateData.avatar = avatarResult.secure_url;

			//delete old avatar
			const user = await User.findById(req.id);
			if (
				user.avatar &&
				user.avatar !== "default-avatar.png"
			) {
				console.log("deleting media from cloudinary");
				await deleteMediaFromCloudinary(user.avatar);
			}
		}
		// update the user and get updated docs

		const updateduser = await User.findByIdAndUpdate(
			req.id,
			updateData,
			{
				new: true,
				runValidators: true,
			}
		);

		if (!updateduser) {
			throw new ApiError("user not found", 404);
		}

		res.status(200).json({
			success: true,
			message: "profile updated successfully",
			data: updateduser,
		});
	}
);

export const getUserBookmarks = catchAsync(async (req, res) => {
    const bookMarkedPrompts= await promptModel.find({bookmarks: req.id}).select("-tags")

		if(!bookMarkedPrompts){
			sendResponse(res, 404, false, "No bookmarks found")
		}

		sendResponse(res, 200, true, "Bookmarks retrieved successfully", bookMarkedPrompts)
});
