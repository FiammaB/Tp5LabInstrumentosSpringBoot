import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


import { Instrumento } from "../models/Instrumento";

import './InstrumentoDetalle.css';
import InstrumentoController from "../controllers/InstrumentoController";
import { useCart } from "../context/CarritoContext";
import { downloadInstrumentoPdf } from '../controllers/ReportesController';
import { useAuth } from '../context/authContext';
const InstrumentoDetalle: React.FC = () => {
  const { addToCart } = useCart();
  const { id } = useParams<{ id: string }>();
  const [instrumento, setInstrumento] = useState<Instrumento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const isAdmin = useAuth().isAdmin; // Verifica si el usuario es Admin
  //const { id } = useParams<{ id: string }>();
  //const instrumento: Instrumento | undefined = instrumento.instrumentos.find((i) => i.id === id);
  useEffect(() => {
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
  // --- Nueva función para manejar la descarga del PDF ---
  const handleDownloadPdf = async () => {
    // Asegurarse de que tenemos un ID válido
    if (!id) {
      setError("No se puede descargar el PDF sin un ID de instrumento.");
      return;
    }

    setDownloadingPdf(true); // Activar estado de descarga
    setError(null); // Limpiar errores anteriores

    try {
      // Convertir el ID de string (de useParams) al tipo esperado por el servicio backend (int)
      const instrumentoIdNumber = parseInt(id, 10); // Usar parseInt para convertir a número

      // Llama a la función del servicio para descargar el PDF
      const response = await downloadInstrumentoPdf(instrumentoIdNumber); // Pasa el ID numérico

      // El servicio ya lanzó un error si la respuesta no fue OK (ej. 404, 500)
      // Si llegamos aquí, la respuesta es OK (200)

      // Manejar la respuesta: obtener el Blob y disparar la descarga
      const blob = await response.blob();

      // Obtener el nombre del archivo del encabezado Content-Disposition si existe
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `ficha_tecnica_instrumento_${id}.pdf`; // Nombre por defecto usando el ID de la URL
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      // Crear URL temporal y disparar descarga (lógica estándar)
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;

      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setDownloadingPdf(false);
      console.log(`PDF "${filename}" descargado con éxito.`);

    } catch (err: unknown) {
      console.error("Error downloading PDF:", err);
      // Mostrar el mensaje de error lanzado por el servicio
      setError("Ocurrió un error al descargar el PDF." + (err as Error).message);
      setDownloadingPdf(false);
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
        <div >
          {isAdmin && (
            <button
              className="btn btn-secondary my-3"
              onClick={handleDownloadPdf}
              disabled={downloadingPdf || !id}
            >
              {downloadingPdf ? 'Generando PDF...' : 'Descargar Ficha Técnica PDF'}
            </button>
          )}
        </div>
        <button
          className={`btn px-4 py-2 mb-4 ${addedToCart ? "btn-success" : "btn-primary"
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
