import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Prompt } from "../types/prompts.types";
import { PromptService } from "@/services/prompt.service";
import { useAuth } from "./AuthContext";

interface OtherContextType {
    userBookmarks: Prompt[];
    setuserBookmarks: React.Dispatch<React.SetStateAction<Prompt[]>>;
    userLikes: Prompt[];
    setuserLikes: React.Dispatch<React.SetStateAction<Prompt[]>>;
    optimisticToggleLike: (prompt: Prompt) => void;
    optimisticToggleBookmark: (prompt: Prompt) => void;
    refetchUserData: () => Promise<void>;
}


const OtherContext = createContext<OtherContextType | null>(null);

export const OtherContextProvider = ({ children }: { children: React.ReactNode }) => {
 const [userBookmarks, setuserBookmarks] = useState<Prompt[]>([])
 const [userLikes, setuserLikes] = useState<Prompt[]>([])
 const {isAuthenticated} = useAuth()

 const getUserBookmarks = async() => {
     try {
      const res = await PromptService.UserBookmarks()

      console.log("response of user bookmark", res);
      if(res.success){
        setuserBookmarks(res.data)
      }
     } catch (error) {
      console.log("error of user bookmark", error);
     }
 }

 const getUserLikes = async() => {
     try {
      const res = await PromptService.UserLikes()

      console.log("response of user likes", res);
      if(res.success){
        setuserLikes(res.data)
      }
     } catch (error) {
      console.log("error of user likes", error);
     }
 }

 // Refetch user data from server
 const refetchUserData = useCallback(async () => {
   await Promise.all([getUserBookmarks(), getUserLikes()]);
 }, []);

 // Optimistic toggle for likes - updates UI immediately
 const optimisticToggleLike = useCallback((prompt: Prompt) => {
   setuserLikes((prev) => {
     const isCurrentlyLiked = prev.some(p => p.id === prompt.id || p._id === prompt._id);

     if (isCurrentlyLiked) {
       // Remove from likes
       console.log('🔵 [Optimistic] Removing like for:', prompt.title);
       return prev.filter(p => !(p.id === prompt.id || p._id === prompt._id));
     } else {
       // Add to likes
       console.log('🔵 [Optimistic] Adding like for:', prompt.title);
       return [...prev, prompt];
     }
   });
 }, []);

 // Optimistic toggle for bookmarks - updates UI immediately
 const optimisticToggleBookmark = useCallback((prompt: Prompt) => {
   setuserBookmarks((prev) => {
     const isCurrentlyBookmarked = prev.some(p => p.id === prompt.id || p._id === prompt._id);

     if (isCurrentlyBookmarked) {
       // Remove from bookmarks
       console.log('🟣 [Optimistic] Removing bookmark for:', prompt.title);
       return prev.filter(p => !(p.id === prompt.id || p._id === prompt._id));
     } else {
       // Add to bookmarks
       console.log('🟣 [Optimistic] Adding bookmark for:', prompt.title);
       return [...prev, prompt];
     }
   });
 }, []);

 useEffect(() => {
  if(isAuthenticated){
    getUserBookmarks()
    getUserLikes()
  }
 }, [isAuthenticated])


  const value = {
    userBookmarks,
    setuserBookmarks,
    userLikes,
    setuserLikes,
    optimisticToggleLike,
    optimisticToggleBookmark,
    refetchUserData
  }
    return (
        <OtherContext.Provider value={value}>
            {children}
        </OtherContext.Provider>
    );
};

export function useOtherContext(): OtherContextType {
  const context = useContext(OtherContext);
  if (context === undefined) {
    throw new Error('useOtherContext must be used within an OtherContextProvider');
  }
  return context!;
}