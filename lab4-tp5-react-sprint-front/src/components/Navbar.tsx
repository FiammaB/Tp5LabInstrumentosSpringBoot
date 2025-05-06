import { Link } from "react-router-dom";
import { useCart } from "../context/CarritoContext";


const Navbar = () => {
  const { totalItems } = useCart();
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark w-100">
       <div className="container-fluid">
      <Link className="navbar-brand" to="/">Musical Endrix</Link>
      <div className="navbar-nav ms-auto d-flex flex-row">
          <Link className="nav-link px-3" to="/">Inicio</Link>
          <Link className="nav-link px-3" to="/dondeEstamos">Dónde Estamos</Link>
          <Link className="nav-link px-3" to="/instrumento">Productos</Link>
          <Link className="nav-link px-3" to="/Grilla">Grilla</Link>
           <Link
                  to="/cart"
                  className="nav-link px-3"
                >
                  <i className="bi bi-cart"></i>
                  {totalItems > 0 && (
                    <span className="badge bg-danger rounded-pill">
                      {totalItems}
                    </span>
                  )}
                </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
