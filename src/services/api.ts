const API_URL = 'http://localhost:3001'; 

// --- USUARIOS ---
export const getUsers = async () => {
  const res = await fetch(`${API_URL}/users`);
  if (!res.ok) throw new Error('Error al obtener los usuarios');
  return res.json();
};

export const createUser = async (nickName: string, email: string) => {
  const res = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nickName, email }),
  });
  return res.json();
};

// --- POSTS ---
export const getPosts = async () => {
  const res = await fetch(`${API_URL}/posts`);  
  return res.json();
};

export const getPostsByUser = async (userId: string | number) => {
  const res = await fetch(`${API_URL}/posts?userId=${userId}`);
  return res.json();
};


export const createPost = async (postData: { description: string; userId: string | number; tags?: any[] }) => {
  const res = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData),
  });
  return res.json();
};

// --- COMENTARIOS E IMÁGENES ---
export const getCommentsByPost = async (postId: string | number) => {
  const res = await fetch(`${API_URL}/comments/post/${postId}`);
  return res.json();
};

// export const createComment = async (commentData: { description: string; postId: string | number; userId: string | number }) => {
//   const res = await fetch(`${API_URL}/comments`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(commentData),
//   });
//   return res.json();
// };

export const createComment = async (commentData: { description: string; postId: string | number; userId: string | number }) => {
  const res = await fetch(`${API_URL}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: commentData.description, // El backend espera "content"
      postId: commentData.postId,
      userId: commentData.userId,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Error del servidor:', errorText);
    throw new Error('Error al crear el comentario');
  }

  return res.json();
};

export const getImagesByPost = async (postId: string | number) => {
  const res = await fetch(`${API_URL}/postimages/post/${postId}`);
  return res.json();
};

export const createPostImage = async (imageData: { url: string; postId: string | number }) => {
  const res = await fetch(`${API_URL}/postimages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(imageData),
  });
  return res.json();
};

// --- ETIQUETAS ---
export const getTags = async () => {
  const res = await fetch(`${API_URL}/tags`);
  return res.json();
};