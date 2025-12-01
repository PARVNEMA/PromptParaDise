import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { sendResponse } from "../utils/responsehandler.js";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const enhancePrompt = async (req, res) => {
	try {
		const { prompt } = req.body;

		if (!prompt) {
			return res.status(400).json({
				success: false,
				message: "Prompt is required",
			});
		}

		if (!process.env.GEMINI_API_KEY) {
			return res.status(500).json({
				success: false,
				message: "Gemini API key is not configured",
			});
		}

		const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

		const enhancementPrompt = `You are an expert prompt engineer. Your task is to rewrite the following prompt to be more descriptive, creative, and detailed, suitable for an AI image generator.

Rules:
1. Return ONLY the enhanced prompt text.
2. Do not provide multiple options.
3. Do not include explanations or "Here is the enhanced prompt:" text.
4. Do not use markdown formatting (no bold, italics, etc.).
5. Keep it within 100-150 words.

Original Prompt: "${prompt}"`;

		const result = await model.generateContent(enhancementPrompt);
		const response = await result.response;
		const text = response.text();

		sendResponse(res, 200, true, "success", text.trim());
	} catch (error) {
		console.error("Error enhancing prompt:", error);
		res.status(500).json({
			success: false,
			message: "Failed to enhance prompt",
			error: error.message,
		});
	}
};
