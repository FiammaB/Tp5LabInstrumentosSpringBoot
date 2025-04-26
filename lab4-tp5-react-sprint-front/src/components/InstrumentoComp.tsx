import React from 'react';
import { Link } from 'react-router-dom';
import './InstrumentoComp.css';
import { Instrumento } from '../models/Instrumento';



type Props = {
  instrumento: Instrumento;
};

const InstrumentoCard: React.FC<Props> = ({ instrumento }) => {
  const envioGratis = instrumento.costoEnvio === 'G';
  const envioTexto = envioGratis
    ? 'Envío gratis a todo el país'
    : `Costo de Envío Interior de Argentina: $${instrumento.costoEnvio}`;
  const envioColor = envioGratis ? 'green' : 'orange';

  const imagen = `/img/${instrumento.imagen}`;
  const iconoCamion = `/img/camion.png`;

  return (
    <Link to={`/detalle/${instrumento.id}`} className="instrumento-link">
      <div className="instrumento-card">
        <img
          src={imagen}
          alt={instrumento.nombre}
          className="instrumento-img"
        />
        <div className="card-body d-flex flex-column">
          <h3 className="card-title">{instrumento.nombre}</h3>
          <p className="card-text">$ {instrumento.precio}</p>

          <p
            className="card-text"
            style={{ color: envioColor }}
          >
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
        <div className="mt-auto">
                                    <Link
                                        to={`/detalle/${instrumento.id}`}
                                        className="btn btn-primary w-100"
                                    >
                                        Ver Detalle
                                    </Link>
                                </div>
      </div>
    </Link>
  );
};

export default InstrumentoCard;
