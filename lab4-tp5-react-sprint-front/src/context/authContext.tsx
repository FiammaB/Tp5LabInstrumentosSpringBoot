// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Usuario } from '../models/Usuario'; 
import { login as apiLogin } from '../controllers/AuthController';

// Define la forma del contexto de autenticación
interface AuthContextType {
  usuario: Usuario | null; // El usuario autenticado, o null si no hay nadie logueado
  login: (nombreUsuario: string, clave: string) => Promise<Usuario>; // Función para iniciar sesión
  logout: () => void; // Función para cerrar sesión
  isAuthenticated: boolean; // Booleano para saber si hay un usuario logueado
  isAdmin: boolean;
  isOperador:boolean;
  isVisor:boolean; // Booleano para saber si el usuario es Admin
}

// Crea el contexto con un valor por defecto (que nunca se usará directamente)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Proveedor del contexto de autenticación
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Estado para almacenar el usuario autenticado
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  // Efecto para cargar el estado de autenticación desde localStorage al iniciar la app
  // Esto permite que el usuario siga logueado si refresca la página
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        // Crea una instancia de la clase Usuario desde los datos almacenados
        setUsuario(new Usuario(userData.id, userData.nombreUsuario, userData.rol));
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        localStorage.removeItem('currentUser'); // Limpiar si hay un error de parseo
      }
    }
  }, []); // El array vacío asegura que este efecto solo se ejecute una vez al montar el componente

  // Función para iniciar sesión
  const login = async (nombreUsuario: string, clave: string): Promise<Usuario> => {
    try {
      const usuarioAutenticado = await apiLogin({ nombreUsuario, clave });
      setUsuario(usuarioAutenticado);
      // Almacena el usuario en localStorage (CON PRECAUCIÓN: no guardar datos sensibles como la clave)
      // Solo guardamos los datos necesarios para identificar al usuario y su rol.
      localStorage.setItem('currentUser', JSON.stringify(usuarioAutenticado));
      // --- NUEVO LOG AQUÍ ---
    console.log("AuthContext - Login exitoso. Usuario establecido:", usuarioAutenticado);
    console.log("AuthContext - Usuario Rol establecido:", usuarioAutenticado.rol);
    // ----------------------

      return usuarioAutenticado;
    } catch (error) {
      console.error("Error during login in context:", error);
      throw error; // Relanza el error para que el componente que llama lo maneje
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('currentUser'); // Elimina el usuario de localStorage
  };

  // Derivados del estado principal para facilitar el acceso
  const isAuthenticated = usuario !== null;
  const isAdmin = usuario?.rol === 'Admin'; // Verifica si el rol es 'Admin'
  const isOperador = usuario?.rol === 'Operador'; // Verifica si el rol es 'Operador'
  const isVisor = usuario?.rol === 'Visor'; // Verifica si el rol es 'Visor'
  return (
    <AuthContext.Provider value={{ usuario, login, logout, isAuthenticated, isAdmin ,isOperador,isVisor}}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para consumir el contexto de autenticación fácilmente
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};