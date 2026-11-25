import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Spinner, Alert, ListGroup, Carousel } from 'react-bootstrap';
import { getPostById, getCommentsByPost, getImagesByPost, createComment } from '../services/api';
import type { Post, Comment, PostImage } from '../types';
import { useAuth } from '../context/AuthContext';

export const PostDetail: React.FC = () => {
  const { id } = useParams();   // el :id de la ruta /post/:id
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [images, setImages] = useState<PostImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Formulario de comentario
  const [newComment, setNewComment] = useState('');
  const [commentError, setCommentError] = useState('');

   useEffect(() => {
    const cargarDetalle = async () => {
      if (!id) return;
      try {
        const postData = await getPostById(id);
        const commentsData = await getCommentsByPost(id);
        const imagesData = await getImagesByPost(id);

        setPost(postData);
        setComments(commentsData);
        setImages(imagesData);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    cargarDetalle();
  }, [id]);

    const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !post) return;

    // Validación: el comentario es obligatorio
    if (newComment.trim() === '') {
      setCommentError('El comentario no puede estar vacío');
      return;
    }
    setCommentError('');

    try {
      const created = await createComment(newComment.trim(), post.id, user.id);
      // La API devuelve el comentario sin el autor: se lo agregamos con el usuario logueado
      setComments([...comments, { ...created, User: user }]);
      setNewComment('');
    } catch (error) {
      setCommentError((error as Error).message);
    }
  };

    if (loading) return <div className="container py-4"><Spinner animation="border" /></div>;

  if (error || !post) {
    return (
      <div className="container py-4">
        <Alert variant="danger">{error || 'La publicación no existe'}</Alert>
        <Link to="/" className="btn btn-outline-secondary">← Volver al feed</Link>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ maxWidth: 720 }}>
      <Link to="/" className="btn btn-outline-secondary mb-3">← Volver al feed</Link>

      {/* Detalle del post */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          {post.User && (
            <Card.Subtitle className="mb-2 text-muted">@{post.User.nickName}</Card.Subtitle>
          )}
          <Card.Text className="fs-5">{post.description}</Card.Text>

                    {images.length === 1 && (
            <img
              src={images[0].url}
              alt="Imagen de la publicación"
              className="img-fluid rounded w-100 mb-3"
              style={{ height: 320, objectFit: 'contain', backgroundColor: '#f1f1f1' }}
            />
          )}

          {images.length > 1 && (
            <Carousel className="mb-3" interval={null}>
              {images.map((img) => (
                <Carousel.Item key={img.id}>
                  <img
                    src={img.url}
                    alt="Imagen de la publicación"
                    className="d-block w-100 rounded"
                    style={{ height: 320, objectFit: 'contain', backgroundColor: '#f1f1f1' }}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          )}

                   <div className="mb-2">
            {post.Tags && post.Tags.map((tag) => (
              <span className={`badge me-1 tag-color-${tag.id % 4}`} key={tag.id}>#{tag.name}</span>
            ))}
          </div>

          <small className="text-muted">
            Publicado el {new Date(post.createdAt).toLocaleDateString('es-AR')}
          </small>
        </Card.Body>
      </Card>

      {/* Comentarios */}
      <h3 className="h5 mb-3">Comentarios ({comments.length})</h3>

      {comments.length === 0 ? (
        <p className="text-muted">No hay comentarios todavía. ¡Sé el primero en comentar!</p>
      ) : (
        <ListGroup className="mb-4">
          {comments.map((comment) => (
            <ListGroup.Item key={comment.id}>
              {comment.User && <strong>@{comment.User.nickName}: </strong>}
              {comment.content}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      {/* Formulario para nuevo comentario */}
      {user ? (
        <form onSubmit={handleCommentSubmit} noValidate>
          <div className="mb-2">
            <textarea
              className={`form-control ${commentError ? 'is-invalid' : ''}`}
              placeholder="Escribí un comentario..."
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            {commentError && <div className="invalid-feedback">{commentError}</div>}
          </div>
          <button type="submit" className="btn btn-primary">Comentar</button>
        </form>
      ) : (
        <Alert variant="info">
          <Link to="/login">Iniciá sesión</Link> para dejar un comentario.
        </Alert>
      )}
    </div>
  );
};