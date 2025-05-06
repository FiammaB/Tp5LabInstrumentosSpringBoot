import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


import { Instrumento } from "../models/Instrumento";

import './InstrumentoDetalle.css';
import InstrumentoController from "../controllers/InstrumentoController";
import { useCart } from "../context/CarritoContext";

const InstrumentoDetalle: React.FC = () => {
  const { addToCart } = useCart();
  const { id } = useParams<{ id: string }>();
  const [instrumento, setInstrumento] = useState<Instrumento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);
  //const { id } = useParams<{ id: string }>();
  //const instrumento: Instrumento | undefined = instrumento.instrumentos.find((i) => i.id === id);
useEffect(()=> {
  InstrumentoController.obtenerInstrumentoPorId(Number(id))
    .then((instrumento) => {
      setInstrumento(instrumento);
      setLoading(false);
    })
    .catch((err) => {
      setError(err.message);
      setLoading(false);
    }
  );
  }, [id]);
  const handleAddToCart = () => {
    if (instrumento && !addedToCart) {
      addToCart(instrumento);
      setAddedToCart(true);
    }
  };

  if (loading) {
    return (
      <div className="container text-center mt-5">Cargando instrumento...</div>
    );
  }

  if (error) {
    return (
      <div className="container text-center mt-5 text-danger">{error}</div>
    );
  }

  if (!instrumento) {
    return (
      <div className="container text-center mt-5">
        Instrumento no encontrado
      </div>
    );
  }
if (loading) return <p>Cargando instrumento...</p>;
if (error) return <p>Error: {error}</p>;
  if (!instrumento) return <p>Instrumento no encontrado</p>;
  

  const imagen = `/img/${instrumento.imagen}`;
  return (
    <div className="instrumento-detalle-container">
      <img
        src={imagen}
        alt={instrumento.nombre}
        className="instrumento-detalle-img"
      />
  
      <div className="instrumento-detalle-info">
        <p className="instrumento-vendidos">{instrumento.cantidadVendida} vendidos</p>
        <h2 className="instrumento-detalle-titulo">{instrumento.nombre}</h2>
        <p className="instrumento-precio">${instrumento.precio}</p>
        <p><strong>Marca:</strong> {instrumento.marca}</p>
        <p><strong>Modelo:</strong> {instrumento.modelo}</p>
        <p><strong>Categoria Instrumento:</strong>{instrumento.categoriaInstrumento?.denominacion}</p>
        <p>
  <strong>Costo Envío:</strong>{" "}
  <span className={`instrumento-envio ${instrumento.costoEnvio === "G" ? "gratis" : ""}`}>
    {instrumento.costoEnvio === "G" ? "Envío gratis" : instrumento.costoEnvio}
  </span>
</p>

<button
            className={`btn px-4 py-2 mb-4 ${
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
          </button>
        <p><strong>Descripción:</strong> {instrumento.descripcion}</p>
      </div>
    </div>
  );
  
};

export default InstrumentoDetalle;
