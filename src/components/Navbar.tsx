import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Navbar as BsNavbar, Nav, Container } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <BsNavbar bg="dark" variant="dark" expand="md" className="mb-3">
      <Container>
        <Link to="/" className="navbar-brand fw-bold">UnaHur Anti-Social Net</Link>

        {/* Botón ☰ que aparece en pantallas chicas */}
        <BsNavbar.Toggle aria-controls="menu-principal" />

        <BsNavbar.Collapse id="menu-principal">
          <Nav className="ms-auto align-items-md-center gap-md-2">
            <NavLink to="/" end className="nav-link">Inicio</NavLink>

            {user ? (
              <>
                <NavLink to="/create-post" className="nav-link">Crear post</NavLink>
                <NavLink to="/profile" className="nav-link">Perfil (@{user.nickName})</NavLink>
                <button onClick={handleLogout} className="btn btn-outline-light btn-sm my-2 my-md-0">
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="nav-link">Iniciar sesión</NavLink>
                <NavLink to="/register" className="nav-link">Registrarse</NavLink>
              </>
            )}
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
};