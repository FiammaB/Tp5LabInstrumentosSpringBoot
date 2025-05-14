import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './InstrumentoComp.css';
import { Instrumento } from '../models/Instrumento';
import { useCart } from '../context/CarritoContext';
import { useAuth } from '../context/authContext';

type Props = {
  instrumento: Instrumento;
};

const InstrumentoCard: React.FC<Props> = ({ instrumento }) => {
  const { addToCart } = useCart();
  const [addedToCart, setAddedToCart] = useState(false);
  const envioGratis = instrumento.costoEnvio === 'G';
  const envioTexto = envioGratis
    ? 'Envío gratis a todo el país'
    : `Costo de Envío Interior de Argentina: $${instrumento.costoEnvio}`;
  const envioColor = envioGratis ? 'green' : 'orange';

  const imagen = `/img/${instrumento.imagen}`;
  const iconoCamion = `/img/camion.png`;
  const auth = useAuth(); 
  const isVisor= auth.isVisor; 
  

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Detiene la propagación del evento
    e.preventDefault(); // Previene el comportamiento por defecto del evento
    
    if (instrumento && !addedToCart && !isVisor) {
      addToCart(instrumento);
      setAddedToCart(true);
    }
  };

  if (!instrumento) {
    return (
      <div className="container text-center mt-5">
        Instrumento no encontrado
      </div>
    );
  }

  return (
    <div className="instrumento-card">
      <Link to={`/detalle/${instrumento.id}`} className="instrumento-link">
        <img
          src={imagen}
          alt={instrumento.nombre}
          className="instrumento-img"
        />
        <div className="card-body d-flex flex-column">
          <h3 className="card-title">{instrumento.nombre}</h3>
          <p className="card-text">$ {instrumento.precio}</p>
          <p className="card-text" style={{ color: envioColor }}>
            {envioGratis && (
              <img
                src={iconoCamion}
                alt="Camión"
                className="instrumento-envio-icono"
              />
            )}
            {envioTexto}
          </p>
          <p className="instrumento-vendidos">{instrumento.cantidadVendida} vendidos</p>
        </div>
      </Link>
      
      <div className="card-buttons">
       {!isVisor &&<Link
          to={`/detalle/${instrumento.id}`}
          className="btn btn-primary w-100"
        >
          Ver Detalle
        </Link>
}
        {!isVisor&&<button
          className={`btn px-4 py-2 mt-2 w-100 ${
            addedToCart ? "btn-success" : "btn-primary"
          }`}
          onClick={handleAddToCart}
          disabled={addedToCart}
        >
          {addedToCart ? (
            <>
              <i className="bi bi-check-circle me-2"></i> Agregado
            </>
          ) : (
            "Agregar al carrito"
          )}
        </button>}
      </div>
    </div>
  );
};

export default InstrumentoCard;