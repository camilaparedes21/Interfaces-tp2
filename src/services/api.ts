import type { User, Post, Comment, PostImage, Tag } from '../types';

const API_URL = 'http://localhost:3001';

// Hace el fetch, revisa res.ok y lanza un Error con el mensaje de la API si algo falla
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor.');
  }

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Ocurrió un error');
  }
  return data;
}

// --- USUARIOS ---
export const getUsers = () => request<User[]>('/users');

export const createUser = (nickName: string, email: string) =>
  request<User>('/users', {
    method: 'POST',
    body: JSON.stringify({ nickName, email }),
  });

// --- POSTS ---
export const getPosts = () => request<Post[]>('/posts');

export const getPostById = (id: number | string) => request<Post>(`/posts/${id}`);

export const getPostsByUser = (userId: number) => request<Post[]>(`/posts?userId=${userId}`);

export const createPost = (description: string, userId: number, tagIds: number[]) =>
  request<Post>('/posts', {
    method: 'POST',
    body: JSON.stringify({ description, userId, tagIds }),
  });

// --- COMENTARIOS ---
export const getCommentsByPost = (postId: number | string) =>
  request<Comment[]>(`/comments/post/${postId}`);

export const createComment = (content: string, postId: number, userId: number) =>
  request<Comment>('/comments', {
    method: 'POST',
    body: JSON.stringify({ content, postId, userId }),
  });

// --- IMÁGENES ---
export const getImagesByPost = (postId: number | string) =>
  request<PostImage[]>(`/postimages/post/${postId}`);

export const createPostImage = (url: string, postId: number) =>
  request<PostImage>('/postimages', {
    method: 'POST',
    body: JSON.stringify({ url, postId }),
  });

// --- ETIQUETAS ---
export const getTags = () => request<Tag[]>('/tags');