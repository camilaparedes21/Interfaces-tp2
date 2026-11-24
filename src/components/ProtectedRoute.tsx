import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();

  // Si no hay usuario logueado, lo mandamos al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <children.type {...children.props} />; // O simplemente renderizar {children}
};