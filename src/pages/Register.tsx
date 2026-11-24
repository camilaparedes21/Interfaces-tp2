import React, { useState } from 'react';
import { createUser } from '../services/api';
import { useNavigate } from 'react-router-dom';

export const Register: React.FC = () => {
  const [nickName, setNickName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await createUser(nickName, email);
      if (res.error || res.message) {
        setError(res.error || res.message);
      } else {
        navigate('/login');
      }
    } catch (err) {
      setError('No se pudo crear el usuario');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: 'auto' }}>
      <h2>Registro de Usuario</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="text"
          placeholder="NickName"
          value={nickName}
          onChange={(e) => setNickName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};