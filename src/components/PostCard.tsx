import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import type { Post, PostImage } from '../types';

interface PostCardProps {
  post: Post;
  images: PostImage[];
  commentCount: number;
}

// Muestra un post en formato card: imagen, autor, descripción, fecha, etiquetas y comentarios
export const PostCard: React.FC<PostCardProps> = ({ post, images, commentCount }) => {
  const primeraImagen = images[0];

  return (
    <Card className="h-100 shadow-sm">
      {primeraImagen && (
        <Card.Img
          variant="top"
          src={primeraImagen.url}
          alt="Imagen de la publicación"
          style={{ height: 200, objectFit: 'contain', backgroundColor: '#f1f1f1' }}
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      )}

      <Card.Body className="d-flex flex-column">
        {post.User && (
          <Card.Subtitle className="mb-2 text-muted">@{post.User.nickName}</Card.Subtitle>
        )}

        <Card.Text>{post.description}</Card.Text>

        <small className="text-muted d-block mb-2">
          Publicado el{' '}
          {new Date(post.createdAt).toLocaleString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          })}
        </small>

        <div className="mb-3">
          {post.Tags && post.Tags.map((tag) => (
            <span className={`badge me-1 tag-color-${tag.id % 4}`} key={tag.id}>
              #{tag.name}
            </span>
          ))}
        </div>

        <div className="mt-auto d-flex justify-content-between align-items-center">
          <small className="text-muted">
            💬 {commentCount} {commentCount === 1 ? 'comentario' : 'comentarios'}
          </small>
          <Link to={`/post/${post.id}`} className="btn btn-primary btn-sm">
            Ver más
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};