export interface PromptResponse {
  success: boolean
  message: string
  data: Prompt[]
  error: any
}
export interface PromptDataProps{
  title: string
  prompt: string
  description: string
  category: string
  image:string
}
export interface DetailPromptDetails {
  _id: string
  title: string
  prompt: string
  description: string
  imageUrl: string
  category: {name:string}
  creator: PromptCreator
  views: number
  isPublic: boolean
  isFeatured: boolean
  createdAt: string
  updatedAt: string
  __v: number
  likeCount: number
  bookmarkCount: number
  id: string
}
export interface PromptCreator{
  name: string
  avatar: string
  id:string
}
export interface Prompt {
  _id: string
  title: string
  prompt: string
  description: string
  tags: any[]
  category: {name:string}
  creator: PromptCreator
  likes: any[]
  bookmarks: any[]
  views: number
  isPublic: boolean
  isFeatured: boolean
  createdAt: string
  updatedAt: string
  __v: number
  likeCount: number
  bookmarkCount: number
  id: string
  imageUrl?: string
}
