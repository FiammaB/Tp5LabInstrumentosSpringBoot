import { Link, useNavigate } from "react-router-dom"; // Importa useNavigate
import { useCart } from "../context/CarritoContext";
import { useAuth } from "../context/authContext"; // Importa el hook de autenticación
import React from 'react'; // Importa React

const Navbar = () => {
  const { totalItems } = useCart();
  const auth = useAuth(); // Obtiene el contexto de autenticación
  const navigate = useNavigate(); // Hook para la navegación programática

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    auth.logout(); // Llama a la función de logout del contexto
    navigate('/login'); // Redirige al usuario a la página de login
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark w-100">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Musical Endrix</Link>

        {/* Puedes añadir un botón de "toggler" de Bootstrap si quieres que sea responsive */}
        {/* <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button> */}

        {/* <div className="collapse navbar-collapse" id="navbarNavAltMarkup"> */} {/* Contenedor si usas toggler */}
          <div className="navbar-nav ms-auto d-flex flex-row align-items-center"> {/* Añadido align-items-center para alinear verticalmente */}

            {/* Enlaces siempre visibles */}
            <Link className="nav-link px-3" to="/">Inicio</Link>
            <Link className="nav-link px-3" to="/dondeEstamos">Dónde Estamos</Link>
            {/* El enlace de productos público podría quedarse si hay una vista de productos para todos */}
             <Link className="nav-link px-3" to="/instrumento">Productos</Link>


            {/* Enlaces Condicionales basados en la Autenticación y Rol */}

            {auth.isAuthenticated ? (
              // Si el usuario está autenticado
              <>
                {/* Muestra el nombre del usuario y rol */}
                {/* Usamos span con clases de Bootstrap para que se vea como un item de nav */}
                <span className="nav-link px-3 text-light">
                  Bienvenido, {auth.usuario?.nombreUsuario} ({auth.usuario?.rol})
                </span>

                {/* Muestra enlaces de administración solo si es Admin */}
                {/* Usamos auth.isAdmin para la condición */}
                {auth.isAdmin && (
                  <>
                     {/* Enlace a Grilla (asumo que es parte del CRUD de Admin) */}
                    <Link className="nav-link px-3" to="/Grilla">Grilla (Admin)</Link>
                    {/* Si tienes otras rutas de Admin como Formulario, añádelas aquí */}
                    {/* <Link className="nav-link px-3" to="/Formulario">Formulario (Admin)</Link> */}
                  </>
                )}

                {/* Botón para Cerrar Sesión */}
                {/* Usamos un button y lo estilzamos para que parezca un nav-link */}
                <button className="nav-link px-3 btn btn-link text-light" onClick={handleLogout}>
                  Cerrar Sesión
                </button>
              </>
            ) : (
              // Si el usuario NO está autenticado
              <>
                {/* Muestra el enlace de Login */}
                <Link className="nav-link px-3" to="/login">Iniciar Sesión</Link>
              </>
            )}

            {/* Enlace al Carrito (siempre visible) */}
           {!auth.isVisor &&  <Link
                to="/cart"
                className="nav-link px-3"
              >
                <i className="bi bi-cart"></i>
                {totalItems > 0 && (
                  <span className="badge bg-danger rounded-pill ms-1"> {/* Añadido ms-1 para margen */}
                    {totalItems}
                  </span>
                )}
              </Link>}

          </div>
        {/* </div> */} {/* Cierre del contenedor si usas toggler */}
      </div>
    </nav>
  );
};

export default Navbar;