// Tipos según lo que devuelve la API del profe (Sequelize + SQLite)

export interface User {
  id: number;
  nickName: string;
  email: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface Post {
  id: number;
  description: string;
  UserId: number;
  createdAt: string;
  updatedAt: string;
  User?: User;     // viene incluido en GET /posts y GET /posts/:id
  Tags?: Tag[];    // idem (con T mayúscula, así lo nombra Sequelize)
}

export interface Comment {
  id: number;
  content: string; // la API usa "content", no "description"
  PostId: number;
  UserId: number;
  createdAt: string;
  User?: User;     // viene incluido en GET /comments/post/:postId
}

export interface PostImage {
  id: number;
  url: string;
  PostId: number;
}