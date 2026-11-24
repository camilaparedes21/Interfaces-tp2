import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ padding: '1rem', background: '#f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <Link to="/" style={{ textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2rem', color: '#333' }}>
          UnaHur Anti-Social Net
        </Link>
      </div>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Link to="/">Home</Link>
        {user ? (
          <>
            <Link to="/create-post">Crear Post</Link>
            <Link to="/profile">Perfil ({user.nickName})</Link>
            <button onClick={handleLogout} style={{ cursor: 'pointer' }}>Cerrar Sesión</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Registro</Link>
          </>
        )}
      </div>
    </nav>
  );
};