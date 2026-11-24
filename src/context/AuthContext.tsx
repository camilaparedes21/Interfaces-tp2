import React, { createContext, useContext, useState } from 'react';
import type { User } from '../types';
import { getUsers } from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (nickName: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Al iniciar, revisamos si hay un usuario guardado en localStorage
    const savedUser = localStorage.getItem('antisuper_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (nickName: string, pass: string) => {
    try {
      // 1. Validar contraseña fija exigida por el TP
      if (pass !== '123456') {
        return { success: false, message: 'Contraseña incorrecta (la clave es 123456)' };
      }

      // 2. Traer los usuarios de la API para verificar si existe el nickName
      const users: User[] = await getUsers();
      const foundUser = users.find((u) => u.nickName.toLowerCase() === nickName.toLowerCase());

      if (!foundUser) {
        return { success: false, message: 'El usuario no existe en la base de datos' };
      }

      // 3. Guardar en estado y localStorage
      setUser(foundUser);
      localStorage.setItem('antisuper_user', JSON.stringify(foundUser));
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Error de conexión con el servidor' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('antisuper_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto fácilmente en los componentes
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};