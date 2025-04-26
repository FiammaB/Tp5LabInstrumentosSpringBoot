import React, { useEffect, useState } from "react";
import { Instrumento } from "../models/Instrumento";
import InstrumentoCard from "./InstrumentoComp";
import InstrumentoController from "../controllers/InstrumentoController";



const InstrumentosLista: React.FC = () => {
  const [instrumentos, setInstrumentos] = useState<Instrumento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    InstrumentoController.obtenerInstrumentos()
      .then((instrumento) => {
        setInstrumentos(instrumento);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando instrumentos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container-fluid my-4">
       <h1 className="text-center mb-4">Lista de Instrumentos</h1>
       <div className="row">
     
      {instrumentos.map((instrumento) => (
        <InstrumentoCard key={instrumento.id} instrumento={instrumento} />
      ))}
    </div>
    </div>
  );
};

export default InstrumentosLista;
