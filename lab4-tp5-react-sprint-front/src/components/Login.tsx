// src/components/Login.tsx
import React, { useState, FormEvent, useEffect } from 'react'; // Importa useEffect


import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const auth = useAuth();
  const navigate = useNavigate();

  // --- NUEVO useEffect para manejar la navegación después del login ---
  useEffect(() => {
    // Este efecto se ejecutará cada vez que auth.isAuthenticated o navigate cambien.
    // Queremos navegar SOLO cuando el usuario esté autenticado.
    if (auth.isAuthenticated) {
      console.log("useEffect detecta autenticación. Navegando a /");
      // Navega a la página principal o dashboard después de que la autenticación sea verdadera
      navigate('/');
    }
  }, [auth.isAuthenticated, navigate]); // Dependencias: Ejecuta el efecto si isAuthenticated o navigate cambian
  // ------------------------------------------------------------------

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setError('');
    setIsLoading(true);

    try {
      // Llama a la función login del CONTEXTO.
      // Esta función actualizará el estado global y hará que useEffect se active.
      await auth.login(nombreUsuario, clave);

      console.log('Intento de login finalizado en componente. El useEffect manejará la navegación.');
      // NOTA: Ya NO llamamos a navigate('/') directamente aquí.
      // Dejamos que el useEffect lo haga cuando el estado de auth.isAuthenticated se actualice.

    } catch (err: unknown) {
      console.error('Error en el login (capturado en componente):', err);
       if (err instanceof Error) {
        setError(err.message || 'Usuario y/o Clave incorrectos, vuelva a intentar');
      } else {
        setError('Ocurrió un error desconocido. Intente de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombreUsuario">Nombre de Usuario:</label>
          <input
            type="text"
            id="nombreUsuario"
            value={nombreUsuario}
            onChange={(e) => setNombreUsuario(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="clave">Clave:</label>
          <input
            type="password"
            id="clave"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Cargando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
};

export default Login;