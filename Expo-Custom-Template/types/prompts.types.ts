export interface PromptResponse {
  success: boolean
  message: string
  data: Prompt[]
  error: any
}

export interface Prompt {
  _id: string
  title: string
  prompt: string
  description: string
  tags: any[]
  category: string
  creator: string
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
