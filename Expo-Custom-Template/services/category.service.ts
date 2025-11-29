import { apiService } from "./api.service";

export const CategoryService = {
 getAllCategories : async()=>{
  try {
    const response = await apiService.get('/category');
    console.log("response of getall categories",response);
    return response;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
 },
 getCategoryPrompts : async(id:string)=>{
  try {
    const response = await apiService.get(`/category/getCategoryPrompts/${id}`);
    console.log("response of getall categori prompts",response);
    return response;
  } catch (error) {
    console.error('Error fetching categories prompts:', error);
    throw error;
  }
 }

}
