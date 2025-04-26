import { Link } from "react-router-dom";


const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark w-100">
       <div className="container-fluid">
      <Link className="navbar-brand" to="/">Musical Endrix</Link>
      <div className="navbar-nav ms-auto d-flex flex-row">
          <Link className="nav-link px-3" to="/">Inicio</Link>
          <Link className="nav-link px-3" to="/dondeEstamos">Dónde Estamos</Link>
          <Link className="nav-link px-3" to="/instrumento">Productos</Link>
          <Link className="nav-link px-3" to="/Grilla">Grilla</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
