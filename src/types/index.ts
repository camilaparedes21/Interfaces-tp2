export interface User {
  id: number | string;
  nickName: string;
}

export interface Post {
  id: number | string;
  description: string;
  userId: number | string;
  createdAt?: string; 
  updatedAt?: string;
}

export interface Comment {
  id: number | string;
  description: string;
  postId: number | string;
  userId: number | string;
}

export interface Tag {
  id: number | string;
  name: string;
}

export interface PostImage {
  id: number | string;
  url: string;
  postId: number | string;
}