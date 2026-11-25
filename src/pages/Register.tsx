import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Alert } from 'react-bootstrap';
import { createUser } from '../services/api';

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({ nickName: '', email: '' });
  const [errors, setErrors] = useState({ nickName: '', email: '' });
  const [error, setError] = useState('');       // error que devuelve la API
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = { nickName: '', email: '' };
    if (formData.nickName.trim() === '') {
      newErrors.nickName = 'El nickName es obligatorio';
    }
    if (formData.email.trim() === '') {
      newErrors.email = 'El email es obligatorio';
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Ingresá un email válido';
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const newErrors = validateForm();
    setErrors(newErrors);
    if (newErrors.nickName !== '' || newErrors.email !== '') return;

    setLoading(true);
    try {
      await createUser(formData.nickName.trim(), formData.email.trim());
      setSuccess(true);
      // Esperamos un momento para que se vea el mensaje y vamos al login
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      setError((error as Error).message);   // ej.: "No se pudo crear el usuario"
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <Card className="mx-auto shadow-sm" style={{ maxWidth: 420 }}>
        <Card.Body className="p-4">
          <h2 className="text-center mb-4">Crear cuenta</h2>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">¡Usuario creado! Te llevamos al login...</Alert>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="nickName" className="form-label">NickName</label>
              <input
                id="nickName"
                name="nickName"
                type="text"
                className={`form-control ${errors.nickName ? 'is-invalid' : ''}`}
                value={formData.nickName}
                onChange={handleChange}
              />
              {errors.nickName && <div className="invalid-feedback">{errors.nickName}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-primary" disabled={loading || success}>
                {loading ? 'Creando cuenta...' : 'Registrarme'}
              </button>
            </div>
          </form>

          <p className="text-center mt-3 mb-0">
            ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
          </p>
        </Card.Body>
      </Card>
    </div>
  );
};