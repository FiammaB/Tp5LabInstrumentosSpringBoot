import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/authContext';

// Define las props para el componente PrivateRoute
interface PrivateRouteProps {
  requiredRoles?: string[]; // El rol requerido para acceder a esta ruta (opcional)
  children?: React.ReactNode; // Contenido a renderizar si se permite el acceso
}

// Componente que verifica la autenticación y el rol
const PrivateRoute: React.FC<PrivateRouteProps> = ({ requiredRoles, children }) => {
  const auth = useAuth(); // Obtiene el contexto de autenticación
  
  // Logs para depuración
  console.log("PrivateRoute - Ruta accedida. auth.isAuthenticated:", auth.isAuthenticated);
  console.log("PrivateRoute - auth.usuario?.rol:", auth.usuario?.rol);
  console.log("PrivateRoute - requiredRoles:", requiredRoles);
  
  //  Verificar si el usuario está autenticado
  if (!auth.isAuthenticated) {
    // Si no está autenticado, redirige a la página de login
    console.log("Usuario no autenticado. Redirigiendo a /login");
    return <Navigate to="/login" replace />;
  }
  
  //  Verificar si se requiere un rol específico y si el usuario tiene ese rol
  if (requiredRoles && requiredRoles.length > 0) {
    const userHasRequiredRole = auth.usuario && requiredRoles.includes(auth.usuario.rol);
    
    console.log("PrivateRoute - Usuario tiene rol requerido:", userHasRequiredRole);
    
    if (!userHasRequiredRole) {
      // Si se requiere un rol y el usuario no lo tiene
      console.log(`Acceso denegado. Rol requerido: ${requiredRoles.join(', ')}, Rol del usuario: ${auth.usuario?.rol}`);
      // Redirigir a una página de "Acceso Denegado" o a la página principal
      return <Navigate to="/" replace />;
    }
  }
  
  // Si está autenticado y tiene el rol correcto (o no se requiere rol)
  // Renderiza los componentes hijos o el Outlet
  console.log("Acceso permitido.");
  return children ? <>{children}</> : <Outlet />;
};

export default PrivateRoute;