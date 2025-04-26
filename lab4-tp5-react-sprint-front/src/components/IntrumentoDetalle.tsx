import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


import { Instrumento } from "../models/Instrumento";

import './InstrumentoDetalle.css';
import InstrumentoController from "../controllers/InstrumentoController";

const InstrumentoDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [instrumento, setInstrumento] = useState<Instrumento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

        <button className="instrumento-agregar-carrito">Agregar al carrito</button>
        <p><strong>Descripción:</strong> {instrumento.descripcion}</p>
      </div>
    </div>
  );
  
};

export default InstrumentoDetalle;
