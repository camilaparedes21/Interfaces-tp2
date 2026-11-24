import React, { useEffect, useState } from 'react';
import { getPosts, getCommentsByPost } from '../services/api';
import type { Post } from '../types';
import { Link } from 'react-router-dom';

// 1. Subcomponente individual para cada post
const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const [commentCount, setCommentCount] = useState<number>(0);

  useEffect(() => {
    getCommentsByPost(post.id)
      .then((comments) => setCommentCount(comments.length))
      .catch(() => setCommentCount(0));
  }, [post.id]);

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0', borderRadius: '8px' }}>
      <p>{post.description}</p>
      <p><small style={{ color: '#666' }}>@{(post as any).User?.nickName || 'Desconocido'}</small></p>
      <p>   {(post as any).Tags?.length > 0 && (
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
      )}</p>    
      <small style={{ color: '#666' }}>Publicado el: {new Date((post as any).createdAt || '').toLocaleString('es-AR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false // Cambia a true si prefieres AM/PM
        })}</small>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <span>💬 {commentCount} comentarios</span>
        <Link to={`/post/${post.id}`}>Ver más</Link>
      </div>
    </div>
  );
};

// 2. Componente Home
export const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPosts()
      .then((data) => setPosts(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando publicaciones...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Feed Principal</h1>
      {posts.length === 0 ? (
        <p>No hay publicaciones todavía.</p>
      ) : (
        posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))
      )}
    </div>
  );
}