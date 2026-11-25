import React, { useEffect, useState } from 'react';
import { Row, Col, Spinner, Alert } from 'react-bootstrap';
import { getPosts, getImagesByPost, getCommentsByPost } from '../services/api';
import { PostCard } from '../components/PostCard';
import type { Post, PostImage } from '../types';

// Cada post del feed junto con los datos que la API trae por separado
interface PostConDatos {
  post: Post;
  images: PostImage[];
  commentCount: number;
}

export const Home: React.FC = () => {
  const [feed, setFeed] = useState<PostConDatos[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarFeed = async () => {
      try {
        // 1. Traemos todos los posts (ya vienen con User y Tags)
        const posts = await getPosts();

        // 2. Por cada post, pedimos sus imágenes y sus comentarios
        const postsConDatos: PostConDatos[] = [];
        for (const post of posts) {
          const images = await getImagesByPost(post.id);
          const comments = await getCommentsByPost(post.id);
          postsConDatos.push({ post, images, commentCount: comments.length });
        }

        setFeed(postsConDatos);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    cargarFeed();
  }, []);

  return (
    <div className="container py-4">
      {/* Banner de bienvenida */}
      <div className="p-4 p-md-5 mb-4 bg-dark text-white rounded-3 text-center">
        <h1 className="display-5 fw-bold">UnaHur Anti-Social Net</h1>
        <p className="lead mb-0">La red social para los que no quieren ser sociales.</p>
      </div>

      <h2 className="mb-3">Publicaciones recientes</h2>

      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && !error && feed.length === 0 && (
        <Alert variant="info">No hay publicaciones todavía.</Alert>
      )}

      <Row xs={1} md={2} lg={3} className="g-4">
        {feed.map((item) => (
          <Col key={item.post.id}>
            <PostCard post={item.post} images={item.images} commentCount={item.commentCount} />
          </Col>
        ))}
      </Row>
    </div>
  );
};