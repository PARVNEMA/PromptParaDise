import { PromptDataProps, PromptResponse } from "@/types/prompts.types";
import { apiService } from "./api.service";
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_CONFIG, AUTH_CONFIG } from '@/config/constants';

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

 postPrompts: async (PromptData: any): Promise<any> => {
  try {
    const token = await SecureStore.getItemAsync(AUTH_CONFIG.TOKEN_KEY);

    const response = await fetch(`${API_CONFIG.BASE_URL}/prompt`, {
      method: 'POST',
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        // Content-Type header is explicitly omitted to let fetch generate the boundary
      },
      body: PromptData,
    });

    const data = await response.json();
    console.log("response of post prompts", data);

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create prompt');
    }

    return data;
  } catch (error) {
    console.error('Error post prompts:', error);
    throw error;
  }
 },
 getUserPrompts : async({index,top}:any):Promise<PromptResponse>=>{
  try {
    const params = new URLSearchParams();
    params.append('index', index.toString());
    params.append('top', top.toString());
    const response = await apiService.get(`/prompt/userPrompts?${params.toString()}`);
    console.log("response of getall User prompts",response);
    return response;
  } catch (error) {
    console.error('Error fetching User prompts:', error);
    throw error;
  }
 },
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
 },
 promptEnhancer:async(prompt:string):Promise<any>=>{
  try {
    const response = await apiService.post('/ai/enhance', { prompt });
    console.log("response of prompt enhancer", response);
    return response;
  } catch (error) {
    console.error('Error getting prompt enhancer:', error);
    throw error;
  }
}
}
