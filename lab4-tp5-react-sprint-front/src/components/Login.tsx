// src/components/Login.tsx
import React, { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import '../components/style/login.css'; // Asegúrate de tener el CSS para estilos
const Login: React.FC = () => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) {
      console.log("useEffect detecta autenticación. Navegando a /");
      navigate('/');
    }
  }, [auth.isAuthenticated, navigate]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await auth.login(nombreUsuario, clave);
      console.log('Intento de login finalizado en componente.');
    } catch (err: unknown) {
      console.error('Error en el login:', err);
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
    <div className="login-moderno-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Iniciar Sesión</h2>
          <p>Ingresa tus credenciales para continuar</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <i className="input-icon fas fa-user"></i>
            <input
              type="text"
              id="nombreUsuario"
              className="login-input"
              placeholder="Nombre de usuario"
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <i className="input-icon fas fa-lock"></i>
            <input
              type="password"
              id="clave"
              className="login-input"
              placeholder="Contraseña"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              required
            />
          </div>
          
          {error && <p className="error-message">{error}</p>}
          
          <button 
            type="submit" 
            className="btn-login"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading-spinner"></span>
            ) : 'Entrar'}
          </button>
        </form>
        
     
      </div>
    </div>
  );
};

export default Login;