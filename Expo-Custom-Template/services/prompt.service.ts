import { apiService } from "./api.service";

export const PromptService = {
 getAllPrompts : async()=>{
  try {
    const response = await apiService.get('/prompt');
    console.log("response of getall prompts",response);
    return response.data;
  } catch (error) {
    console.error('Error fetching prompts:', error);
    throw error;
  }
 }
}
