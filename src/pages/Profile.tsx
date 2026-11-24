import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getPostsByUser } from '../services/api';
import type { Post } from '../types';
import { Link, useNavigate } from 'react-router-dom';

export const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!user) return;
      try {
        const posts = await getPostsByUser(user.id);
        setUserPosts(posts);
      } catch (err) {
        console.error('Error al cargar las publicaciones del usuario:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>No has iniciado sesión.</p>
        <Link to="/login">Ir al Login</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h2>Perfil de Usuario</h2>
      
      {/* Información del usuario */}
      <div style={{ background: '#f4f4f4', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <p><strong>NickName:</strong> {user.nickName}</p>
        <p><strong>Correo electrónico:</strong> {(user as any).email}</p>
        <p><strong>Registrado el:</strong> {new Date((user as any).createdAt || '').toLocaleString('es-AR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false // Cambia a true si prefieres AM/PM
        })}</p>
        <button 
          onClick={handleLogout}
          style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Cerrar Sesión
        </button>
      </div>

      {/* Publicaciones del usuario */}
      <h3>Mis Publicaciones</h3>
      {loading ? (
        <p>Cargando tus publicaciones...</p>
      ) : userPosts.length === 0 ? (
        <p style={{ color: '#666' }}>Todavía no realizaste ninguna publicación.</p>
      ) : (
        userPosts.map((post) => (
          <div key={post.id} style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0', borderRadius: '8px', background: '#fff' }}>
            <p>{post.description}</p>
            <Link to={`/post/${post.id}`}>Ver detalle</Link>
          </div>
        ))
      )}
    </div>
  );
};