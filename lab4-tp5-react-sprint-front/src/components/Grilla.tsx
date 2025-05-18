import React, { useEffect, useState } from "react";
import { Instrumento } from "../models/Instrumento";
import "./Grilla.css";
import { Link, useNavigate } from "react-router-dom";
import InstrumentoController from "../controllers/InstrumentoController";

const Grilla: React.FC = () => {
  const [instrumentos, setInstrumentos] = useState<Instrumento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // ✅
  const cargarInstrumentos = () => {
    setLoading(true);
    InstrumentoController.obtenerInstrumentos()
      .then((instrumentos) => {
        setInstrumentos(instrumentos);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };
  useEffect(() => {
    cargarInstrumentos();
  }, []);


  const eliminarInstrumento = (id: number) => {
    const confirmado = window.confirm("¿Estás seguro de que querés eliminar este instrumento?");
    if (!confirmado) return;
    InstrumentoController.eliminarInstrumento(id)
      .then(() => cargarInstrumentos())
      .catch((err) => alert("Error al eliminar el instrumento: " + err.message));
  };

  const editarInstrumento = (instrumento: Instrumento) => {
    navigate('/formulario', { state: instrumento }); // ✅ Navegar con datos para editar
  };

  if (loading) return <p>Cargando instrumentos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container-fluid my-4">
      <h1 className="text-center mb">Grilla de Instrumentos</h1>
      <div className="d-grid gap-2 col-2
             mx-auto">
        <Link to={`/formulario`}
          className="btn btn-success border-1 border-shadow"
        >
          Crear Nuevo Instrumento
        </Link>

      </div>

      <div className="row g-4 my-2 border-bottom border-1 border-shadow">
        <div className="col-6">Instrumento</div>
        <div className="col-1">Marca</div>
        <div className="col-1">Modelo</div>
        <div className="col-1">Precio</div>
        <div className="col-1">Cantidad Vendida</div>
        <div className="col-1">Modificar</div>
        <div className="col-1">Eliminar</div>
      </div>
      <div className="instrumento-lista">
        {instrumentos.map((instrumento) => (
          <div key={instrumento.id} >


            <div className="row g-4 my-2 border-bottom border-1 border-shadow  ">
              <img className="col-1" src={`/img/${instrumento.imagen}`} alt={instrumento.nombre} />
              <div className="col-5 ">{instrumento.nombre}</div>
              <div className="col-1">{instrumento.marca}</div>
              <div className="col-1">{instrumento.modelo}</div>
              <div className="col-1">{instrumento.precio}</div>
              <div className="col-1">{instrumento.cantidadVendida}</div>

              <div className="col-1  text-center my-auto"><button
                onClick={() => editarInstrumento(instrumento)}
                className="btn btn-warning ">
                Modificar
              </button>
              </div>
              <div className="col-1  text-center my-auto" >
                <button
                  onClick={() => eliminarInstrumento(instrumento.id)}
                  className="btn btn-danger"
                  disabled={loading} >
                  {loading ? 'Eliminando...' : 'Eliminar'}

                </button>
              </div>

            </div>

          </div>
        ))}
      </div>
      <br />
      <div className="d-grid gap-2 col-2 mx-auto">
        {/* --- NUEVO ENLACE A REPORTE EXCEL --- */}
        {/* Este enlace solo será visible si el usuario es Admin O Operador */}
        <Link className="btn btn-success border-1 border-shadow" to="/reportes/excel"> Crear Reporte (Excel)</Link>
      </div>
      <br />
    </div>
  );
};

export default Grilla;
