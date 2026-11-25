import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Spinner, Alert, Card } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { getPostsByUser, getImagesByPost, getCommentsByPost } from '../services/api';
import { PostCard } from '../components/PostCard';
import type { Post, PostImage } from '../types';

// Cada post junto con los datos que la API trae por separado
interface PostConDatos {
  post: Post;
  images: PostImage[];
  commentCount: number;
}

export const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [userPosts, setUserPosts] = useState<PostConDatos[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarPosts = async () => {
      if (!user) return;
      try {
        // 1. Traemos solo los posts de este usuario (GET /posts?userId=...)
        const posts = await getPostsByUser(user.id);

        // 2. Por cada post, pedimos sus imágenes y sus comentarios
        const postsConDatos: PostConDatos[] = [];
        for (const post of posts) {
          const images = await getImagesByPost(post.id);
          const comments = await getCommentsByPost(post.id);
          postsConDatos.push({ post, images, commentCount: comments.length });
        }

        setUserPosts(postsConDatos);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    cargarPosts();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // La ruta es protegida, así que siempre hay usuario; esto es para TypeScript
  if (!user) return null;

  return (
    <div className="container py-4">
      {/* Datos del usuario */}
      <Card className="mb-4 shadow-sm">
        <Card.Body className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <h2 className="mb-1">@{user.nickName}</h2>
            <small className="text-muted">{user.email}</small>
          </div>
          <div className="d-flex gap-2">
            <Link to="/create-post" className="btn btn-primary">Nueva publicación</Link>
            <button onClick={handleLogout} className="btn btn-outline-danger">Cerrar sesión</button>
          </div>
        </Card.Body>
      </Card>

      {/* Publicaciones del usuario */}
      <h3 className="mb-3">Mis publicaciones</h3>

      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && !error && userPosts.length === 0 && (
        <Alert variant="info">Todavía no realizaste ninguna publicación.</Alert>
      )}

      <Row xs={1} md={2} lg={3} className="g-4">
        {userPosts.map((item) => (
          <Col key={item.post.id}>
            <PostCard post={item.post} images={item.images} commentCount={item.commentCount} />
          </Col>
        ))}
      </Row>
    </div>
  );
};