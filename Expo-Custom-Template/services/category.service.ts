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
 }

}
