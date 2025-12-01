import { PromptDataProps, PromptResponse } from "@/types/prompts.types";
import { apiService } from "./api.service";

export const PromptService = {
 getAllPrompts : async(search: string = '', index: number = 0, top: number = 10):Promise<PromptResponse>=>{
  try {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    params.append('index', index.toString());
    params.append('top', top.toString());

    const response = await apiService.get(`/prompt?${params.toString()}`);
    // console.log("response of getall prompts",response);
    return response;
  } catch (error) {
    console.error('Error fetching prompts:', error);
    throw error;
  }
 },

 postPrompts:async(PromptData:PromptDataProps):Promise<any>=>{
  try {
    const response = await apiService.post('/prompt',PromptData);
    console.log("response of post prompts",response);
    return response;
  } catch (error) {
    console.error('Error post prompts:', error);
    throw error;
  }
 }
,
 getUserPrompts : async():Promise<PromptResponse>=>{
  try {
    const response = await apiService.get('/prompt/userPrompts');
    console.log("response of getall User prompts",response);
    return response;
  } catch (error) {
    console.error('Error fetching User prompts:', error);
    throw error;
  }
 }
,
 getPromptById : async(id:string):Promise<PromptResponse>=>{
  try {
    const response = await apiService.get(`/prompt/getprompt/${id}`);
    console.log("response of getall User prompts",response);
    return response;
  } catch (error) {
    console.error('Error fetching User prompts:', error);
    throw error;
  }
 },

 toggleLike: async(id: string): Promise<any> => {
  try {
    const response = await apiService.post(`/prompt/toggleLike/${id}`, {});
    console.log("response of toggle like", response);
    return response;
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
 },

 toggleBookmark: async(id: string): Promise<any> => {
  try {
    const response = await apiService.post(`/prompt/toggleBookmark/${id}`, {});
    console.log("response of toggle bookmark", response);
    return response;
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    throw error;
  }
 },

 UserBookmarks: async(): Promise<PromptResponse> => {
  try {
    const response = await apiService.get('/user/bookmarks');
    console.log("response of user bookmark", response);
    return response;
  } catch (error) {
    console.error('Error getting user bookmark:', error);
    throw error;
  }
 },

 UserLikes: async(): Promise<PromptResponse> => {
  try {
    const response = await apiService.get('/prompt/userLikes');
    console.log("response of user likes", response);
    return response;
  } catch (error) {
    console.error('Error getting user likes:', error);
    throw error;
  }
 }
}
