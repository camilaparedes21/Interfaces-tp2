import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Alert } from 'react-bootstrap';
import { createPost, createPostImage, getTags } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Tag } from '../types';

export const CreatePost: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [description, setDescription] = useState('');
  const [imageUrls, setImageUrls] = useState('');                    // texto del textarea: una URL por línea o separadas por coma
  const [tags, setTags] = useState<Tag[]>([]);                       // etiquetas disponibles (API)
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]); // etiquetas marcadas

  const [errors, setErrors] = useState({ description: '', urls: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Al montar la página, traemos las etiquetas desde la API
  useEffect(() => {
    const cargarTags = async () => {
      try {
        const data = await getTags();
        setTags(data);
      } catch (error) {
        setError((error as Error).message);
      }
    };
    cargarTags();
  }, []);

  // ----- Etiquetas: marcar / desmarcar -----
  const handleTagChange = (tagId: number) => {
    if (selectedTagIds.includes(tagId)) {
      setSelectedTagIds(selectedTagIds.filter((id) => id !== tagId));
    } else {
      setSelectedTagIds([...selectedTagIds, tagId]);
    }
  };

  // ----- Validación -----
  const validateForm = (urlsCargadas: string[]) => {
    const newErrors = { description: '', urls: '' };

    if (description.trim() === '') {
      newErrors.description = 'La descripción es obligatoria';
    }

    for (const url of urlsCargadas) {
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        newErrors.urls = 'Las URLs deben empezar con http:// o https://';
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Convertimos el texto del textarea en una lista de URLs:
    // las comas pasan a ser saltos de línea, separamos por línea, sacamos espacios y descartamos vacías
    const urlsCargadas = imageUrls
      .replaceAll(',', '\n')
      .split('\n')
      .map((url) => url.trim())
      .filter((url) => url !== '');

    const newErrors = validateForm(urlsCargadas);
    setErrors(newErrors);
    if (newErrors.description !== '' || newErrors.urls !== '') return;

    setLoading(true);
    setError('');

    try {
      // 1. Creamos el post con descripción, usuario y etiquetas
      const newPost = await createPost(description.trim(), user.id, selectedTagIds);

      // 2. Por cada URL, asociamos la imagen al post recién creado
      for (const url of urlsCargadas) {
        await createPostImage(url, newPost.id);
      }

      // 3. Redirigimos al perfil
      navigate('/profile');
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <Card className="mx-auto shadow-sm" style={{ maxWidth: 640 }}>
        <Card.Body>
          <h2 className="mb-4">Crear nueva publicación</h2>

          {error && <Alert variant="danger">{error}</Alert>}

          <form onSubmit={handleSubmit} noValidate>
            {/* Descripción */}
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Descripción *</label>
              <textarea
                id="description"
                className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                placeholder="¿Qué estás pensando?"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {errors.description && <div className="invalid-feedback">{errors.description}</div>}
            </div>

            {/* URLs de imágenes */}
            <div className="mb-3">
              <label htmlFor="imageUrls" className="form-label">Imágenes (opcional)</label>
              <textarea
                id="imageUrls"
                className={`form-control ${errors.urls ? 'is-invalid' : ''}`}
                rows={4}
                placeholder={'https://ejemplo.com/foto1.jpg\nhttps://ejemplo.com/foto2.jpg'}
                value={imageUrls}
                onChange={(e) => setImageUrls(e.target.value)}
              />
              {errors.urls && <div className="invalid-feedback">{errors.urls}</div>}
              <div className="form-text">Una URL por línea o separadas por coma.</div>
            </div>

            {/* Etiquetas */}
            <div className="mb-4">
              <label className="form-label d-block">Etiquetas</label>
              {tags.length === 0 && <p className="text-muted small">No hay etiquetas disponibles.</p>}
              {tags.map((tag) => (
                <div className="form-check form-check-inline" key={tag.id}>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`tag-${tag.id}`}
                    checked={selectedTagIds.includes(tag.id)}
                    onChange={() => handleTagChange(tag.id)}
                  />
                  <label className="form-check-label" htmlFor={`tag-${tag.id}`}>#{tag.name}</label>
                </div>
              ))}
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Publicando...' : 'Publicar'}
            </button>
          </form>
        </Card.Body>
      </Card>
    </div>
  );
};