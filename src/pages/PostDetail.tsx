import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPosts, getCommentsByPost, getImagesByPost, createComment } from '../services/api';
import type { Post, Comment, PostImage } from '../types';
import { useAuth } from '../context/AuthContext';

export const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [images, setImages] = useState<PostImage[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const posts = await getPosts();    
        const foundPost = posts.find((p: Post) => String(p.id) === id);            
        if (!foundPost) {
          setError('Publicación no encontrada');
          setLoading(false);
          return;
        }

        setPost(foundPost);

        const [commentsData, imagesData] = await Promise.all([
          getCommentsByPost(id!),
          getImagesByPost(id!)
        ]);

        setComments(commentsData);
        setImages(imagesData);
      } catch (err) {
        console.error(err);
        setError('Error al cargar la publicación');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPostData();
    }
  }, [id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Debes iniciar sesión para comentar');
      return;
    }
    if (!newComment.trim()) return;

    try {
      // Enviamos 'content' porque así lo espera el backend
      const created = await createComment({
        description: newComment, // O podés pasarle directamente content: newComment si ajustaste el api.ts
        postId: Number(id),
        userId: user.id
      } as any);
      const createdWithUser = {
        ...created,
        User: {
          nickName: user.nickName // Asegúrate de que la propiedad en tu objeto 'user' se llame así
        }
      };
      setComments([...comments, createdWithUser]);
      setNewComment('');
    } catch (err) {
      console.error(err);
      alert('No se pudo enviar el comentario');
    }
  };

  if (loading) return <p style={{ padding: '2rem' }}>Cargando detalles de la publicación...</p>;
  if (error || !post) {
    return (
      <div style={{ padding: '2rem' }}>
        <p style={{ color: 'red' }}>{error || 'El post no existe'}</p>
        <Link to="/">Volver al Feed</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <Link to="/">← Volver al Feed</Link>
      
      {/* Detalle del Post */}
      <div style={{ border: '1px solid #ccc', padding: '1.5rem', margin: '1rem 0', borderRadius: '8px', background: '#fff' }}>
        <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>{post.description}</p>
        {images.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', marginBottom: '1rem' }}>
            {images.map((img) => (
              <img key={img.id} src={img.url} alt="Post attachment" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '4px' }} />
            ))}
          </div>
        )}
        <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>@{(post as any).User?.nickName || 'Desconocido'}</p>        
        {(post as any).Tags?.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {(post as any).Tags.map((tag: any, index: number) => (
              <span
                key={tag.id || index}
                style={{
                  background: '#eef2ff',
                  color: '#3730a3',
                  padding: '0.25rem 0.6rem',
                  borderRadius: '999px',
                  fontSize: '0.85rem'
                }}
              >#{tag.name}
              </span>
            ))}
          </div>
        )}

        <small style={{ color: '#666' }}>Publicado el: {new Date((post as any).createdAt || '').toLocaleString('es-AR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false // Cambia a true si prefieres AM/PM
        })}</small>
      </div>

      {/* Sección de Comentarios */}
      <h3>Comentarios</h3>
      {comments.length === 0 ? (
        <p style={{ color: '#666' }}>No hay comentarios todavía. ¡Sé el primero en comentar!</p>
      ) : (
        comments.map((comment) => (
          <div key={comment.id} style={{ background: '#f9f9f9', padding: '0.75rem', margin: '0.5rem 0', borderRadius: '6px', border: '1px solid #eee' }}>
            {/* Usamos comment.content que es la propiedad que devuelve la base de datos */}
            <p style={{ margin: 0 }}>{(comment as any).content || comment.description}</p>
            <small style={{ display: 'flex', flexDirection: 'column', gap: '4px', color: '#666' }}>@{(comment as any).User?.nickName || 'Desconocido'}</small>
            <small style={{ display: 'flex', flexDirection: 'column', gap: '4px', color: '#666' }}>Publicado el: {new Date((comment as any).createdAt || '').toLocaleString('es-AR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false // Cambia a true si prefieres AM/PM
            })}</small>
          </div>
        ))
      )}

      {/* Formulario para nuevo comentario */}
      {user ? (
        <form onSubmit={handleCommentSubmit} style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <textarea
            placeholder="Escribe un comentario..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            required
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button type="submit" style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Comentar</button>
        </form>
      ) : (
        <p style={{ marginTop: '1.5rem', fontStyle: 'italic' }}>
          <Link to="/login">Inicia sesión</Link> para dejar un comentario.
        </p>
      )}
    </div>
  );
};