import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";
// *resuable code
// ? sometimes env variables are not able to load properly in cloudinary file thats why we are reconfiguring it
dotenv.config({});

//check and load env variables

cloudinary.config({
	api_key: process.env.API_KEY,
	api_secret: process.env.API_SECRET,
	cloud_name: process.env.CLOUD_NAME,
});

console.log("Cloudinary Config Check:", {
	hasApiKey: !!process.env.API_KEY,
	hasApiSecret: !!process.env.API_SECRET,
	hasCloudName: !!process.env.CLOUD_NAME,
});

export const uploadMedia = async (file) => {
	try {
		const uploadResponse = await cloudinary.uploader.upload(
			file,
			{
				resource_type: "auto",
			}
		);
		if (!uploadResponse?.secure_url) {
			console.log("error in uploading to cloudinary");
		}
		fs.unlinkSync(file);
		return uploadResponse;
	} catch (error) {
		fs.unlinkSync(file);
		console.log("error in uploading media to cloudinary");

		console.log(error);
	}
};
export const deleteMediaFromCloudinary = async (
	publicId
) => {
	try {
		console.log("deleting media from cloudinary", publicId);
		const res = await cloudinary.uploader.destroy(publicId);
		console.log("deleted res=", res);
	} catch (error) {
		console.log("error in deleting media from cloudinary");

		console.log(error);
	}
};
