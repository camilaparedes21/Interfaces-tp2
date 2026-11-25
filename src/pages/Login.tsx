import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const [formData, setFormData] = useState({ nickName: '', password: '' });
  const [errors, setErrors] = useState({ nickName: '', password: '' });
  const [error, setError] = useState('');   // error del login (usuario inexistente, etc.)
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Un solo handler para los dos inputs, como en el repo del profe
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = { nickName: '', password: '' };
    if (formData.nickName.trim() === '') {
      newErrors.nickName = 'El nickName es obligatorio';
    }
    if (formData.password.trim() === '') {
      newErrors.password = 'La contraseña es obligatoria';
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const newErrors = validateForm();
    setErrors(newErrors);
    if (newErrors.nickName !== '' || newErrors.password !== '') return;

    setLoading(true);
    const result = await login(formData.nickName.trim(), formData.password);
    setLoading(false);

    if (result.success) {
      navigate('/profile');
    } else {
      setError(result.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="container py-4">
      <Card className="mx-auto shadow-sm" style={{ maxWidth: 420 }}>
        <Card.Body className="p-4">
          <h2 className="text-center mb-4">Iniciar sesión</h2>

          {error && <Alert variant="danger">{error}</Alert>}

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
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              <div className="form-text">La contraseña es 123456.</div>
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Ingresando...' : 'Ingresar'}
              </button>
            </div>
          </form>

          <p className="text-center mt-3 mb-0">
            ¿No tenés cuenta? <Link to="/register">Registrate</Link>
          </p>
        </Card.Body>
      </Card>
    </div>
  );
};