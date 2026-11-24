import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost, createPostImage } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const CreatePost: React.FC = () => {
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Debes iniciar sesión para publicar');
      return;
    }

    if (!description.trim()) {
      setError('La descripción no puede estar vacía');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Creamos el post vinculando el ID del usuario logueado
      const newPost = await createPost({
        description,
        userId: user.id
      });

      // 2. Convertimos el texto del textarea en un arreglo limpio
      const urlsArray = imageUrl
        .split('\n')                  // Separa por cada salto de línea
        .map((url) => url.trim())     // Quita espacios innecesarios
        .filter((url) => url !== ''); // Ignora líneas vacías

      // 3. Si el usuario ingresó una URL de imagen, la guardamos asociada al post creado
      if (urlsArray.length > 0 && newPost && newPost.id) {
        await Promise.all(
          urlsArray.map((url) =>
            createPostImage({
              url: url,
              postId: newPost.id,
            })
          )
        );
      }

      // 4. Redirigimos al Home para ver el feed actualizado
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('No se pudo crear la publicación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: 'auto' }}>
      <h2>Crear Nueva Publicación</h2>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="description">¿Qué estás pensando?</label>
          <textarea
            id="description"
            placeholder="Escribe el contenido de tu publicación..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            required
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="imageUrl">URLs de imágenes (una por línea)</label>
          <textarea
            id="imageUrl"
            rows={4}
            placeholder={"https://ejemplo.com\nhttps://ejemplo.com"}
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: '0.75rem', cursor: 'pointer', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}
        >
          {loading ? 'Publicando...' : 'Publicar'}
        </button>
      </form>
    </div>
  );
};