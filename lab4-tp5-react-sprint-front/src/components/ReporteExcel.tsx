// src/pages/ReporteExcelPage.tsx
import React, { useState, FormEvent } from 'react';
import { downloadExcelReport } from '../controllers/ReportesController';
// Puedes necesitar un servicio de reportes en frontend si mueves la lógica fetch allí
// import { downloadExcelReport } from '../services/reportesService';


const ReporteExcelPage: React.FC = () => {
  // Estados para las fechas del filtro
  const [fechaDesde, setFechaDesde] = useState<string>(''); // Usamos string para los inputs tipo date
  const [fechaHasta, setFechaHasta] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función que se ejecuta al enviar el formulario o hacer clic en el botón
  const handleDownloadReport = async (event?: FormEvent) => { // Hacemos event opcional por si no se llama desde un form submit
    event?.preventDefault(); // Previene el comportamiento por defecto del formulario si se llama desde un submit

    // Validar que las fechas no estén vacías
    if (!fechaDesde || !fechaHasta) {
      setError("Por favor, selecciona ambas fechas para generar el reporte.");
      return;
    }

    setError(null); // Limpiar errores anteriores
    setLoading(true); // Activar estado de carga

    try {
      
        const response = await downloadExcelReport(fechaDesde, fechaHasta);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al generar el reporte Excel: ${response.status} - ${errorText}`);
      }

      // --- Manejar la respuesta (archivo binario) y descargar ---
      // El backend envía un Blob (datos binarios)
      const blob = await response.blob();

      // Crear una URL temporal para el Blob
      const url = window.URL.createObjectURL(blob);

      // Crear un enlace (<a>) temporal para disparar la descarga
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ReportePedidos.xlsx'; // Nombre sugerido para el archivo descargado

      // Añadir el enlace al DOM, hacer clic en él programáticamente y luego eliminarlo
      document.body.appendChild(a);
      a.click();

      // Limpiar la URL temporal después de la descarga
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setLoading(false);
      console.log("Reporte Excel descargado con éxito.");

    } catch (err: unknown) {
      console.error("Error downloading Excel report:", err);
      setError( `Ocurrió un error al descargar el reporte Excel.${(err as Error).message}` );
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4"> {/* Usamos clases de Bootstrap */}
      <h1>Reporte de Pedidos en Excel</h1>
      <p>Selecciona un rango de fechas para generar el reporte.</p>

      {/* Usamos un div simple o un form */}
      <div className="mb-3"> {/* Margen inferior */}
        <label htmlFor="fechaDesde" className="form-label">Fecha Desde:</label>
        <input
          type="date"
          className="form-control" // Clase de Bootstrap
          id="fechaDesde"
          value={fechaDesde}
          onChange={(e) => setFechaDesde(e.target.value)}
          required
        />
      </div>

      <div className="mb-3"> {/* Margen inferior */}
        <label htmlFor="fechaHasta" className="form-label">Fecha Hasta:</label>
        <input
          type="date"
          className="form-control" // Clase de Bootstrap
          id="fechaHasta"
          value={fechaHasta}
          onChange={(e) => setFechaHasta(e.target.value)}
          required
        />
      </div>

      {error && <div className="alert alert-danger">{error}</div>} {/* Muestra errores con estilo Bootstrap */}
      {loading && <p>Generando reporte...</p>} {/* Indicador de carga */}


      {/* Botón para descargar el reporte */}
      {/* Podría ser un botón dentro de un form con onSubmit={handleDownloadReport} */}
       <button
         className="btn btn-success" // Clase de Bootstrap
         onClick={() => handleDownloadReport()} // Llamamos a la función al hacer clic
         disabled={loading || !fechaDesde || !fechaHasta} // Deshabilitar si está cargando o faltan fechas
       >
         Generar Reporte Excel
       </button>


    </div>
  );
};

export default ReporteExcelPage;