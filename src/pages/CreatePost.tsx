import React, {useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Alert } from 'react-bootstrap';
import { createPost, createPostImage, getTags } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Tag } from '../types';

export const CreatePost: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [description, setDescription] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>(['']);   // arranca con un campo vacío
  const [tags, setTags] = useState<Tag[]>([]);
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

  // ----- Campos de URL -----
  const handleUrlChange = (index: number, value: string) => {
    const nuevasUrls = imageUrls.map((url, i) => (i === index ? value : url));
    setImageUrls(nuevasUrls);
  };

  const agregarCampoUrl = () => {
    setImageUrls([...imageUrls, '']);
  };

  const quitarCampoUrl = (index: number) => {
    setImageUrls(imageUrls.filter((_url, i) => i !== index));
  };

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

    // Solo tenemos en cuenta los campos de URL que no están vacíos
    const urlsCargadas = imageUrls.map((url) => url.trim()).filter((url) => url !== '');

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
              <label className="form-label">Imágenes (opcional)</label>
              {imageUrls.map((url, index) => (
                <div className="input-group mb-2" key={index}>
                  <input
                    type="text"
                    className={`form-control ${errors.urls ? 'is-invalid' : ''}`}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    value={url}
                    onChange={(e) => handleUrlChange(index, e.target.value)}
                  />
                  {imageUrls.length > 1 && (
                    <button type="button" className="btn btn-outline-danger" onClick={() => quitarCampoUrl(index)}>
                      ✕
                    </button>
                  )}
                </div>
              ))}
              {errors.urls && <div className="text-danger small mb-2">{errors.urls}</div>}
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={agregarCampoUrl}>
                + Agregar otra imagen
              </button>
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

  