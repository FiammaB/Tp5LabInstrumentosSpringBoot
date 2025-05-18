// src/components/charts/CantidadVendidaPorInstrumentoChart.tsx
import React, { useEffect, useState } from 'react';
// Importa el componente Pie de react-chartjs-2
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement, // <-- Necesario para gráficos de torta
  Title,
  Tooltip,
  Legend,
} from 'chart.js'; // Importa los componentes necesarios de Chart.js

// Registrar los componentes de Chart.js que vamos a usar
ChartJS.register(
  ArcElement, // <-- Registrar ArcElement
  Title,
  Tooltip,
  Legend
);
interface ChartJsData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string[];
        borderColor: string;
        borderWidth: number;
    }[];
}
// Importa la función del servicio de reportes
import { getCantidadVendidaPorInstrumento } from '../../controllers/ReportesController'; // Ajusta la ruta si es necesario


const CantidadVendidaPorInstrumentoChart: React.FC = () => {
  const [chartData, setChartData] = useState<ChartJsData| null>(null); // Estado para los datos del gráfico formateados
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndProcessData = async () => {
      try {
        // --- Llama a la nueva función del servicio ---
        const data = await getCantidadVendidaPorInstrumento(); // Usa el servicio
        // --------------------------------------------

        // Asegurarse de que 'data' sea un array antes de intentar procesar
        if (!Array.isArray(data)) {
             console.error("API response for instrument sales is not an array:", data);
             setError("Formato de datos inesperado para ventas por instrumento.");
             setLoading(false);
             setChartData(null);
             return;
        }


        // Formatear los datos para Chart.js (Gráfico de Torta)
        // Necesitamos labels (nombres de instrumentos), data (cantidades vendidas),
        // y backgroundColor (un color por cada segmento/instrumento)
        const labels = data.map(item => item[0]); // item[0] es el nombre del instrumento
        const quantities = data.map(item => item[1]); // item[1] es la cantidad vendida

        // Generar colores de fondo dinámicamente (o usar una paleta predefinida)
        const backgroundColors = data.map(() => `hsl(${Math.random() * 360}, 70%, 50%)`); // Colores aleatorios

        // Preparar el objeto de datos para Chart.js
        setChartData({
          labels: labels, // Nombres de los instrumentos
          datasets: [
            {
              label: 'Cantidad Vendida', // Etiqueta para la leyenda (opcional en torta)
              data: quantities, // Cantidades vendidas
              backgroundColor: backgroundColors, // Array de colores
              borderColor: '#ffffff', // Color del borde entre segmentos
              borderWidth: 1,
            },
          ],
        });

        setLoading(false);

      } catch (err: unknown) {
        console.error("Error fetching and processing instrument sales chart data:", err);
         setError( `Error al cargar los datos del gráfico de ventas por instrumento. ${err}`);
        setLoading(false);
        setChartData(null); // En caso de error, asegurar que chartData sea null 
      }
    };

    fetchAndProcessData();

  }, []); // Array de dependencias vacío

  // Opciones de configuración para el gráfico de torta (opcional)
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Cantidad Total Vendida por Instrumento', // Título del gráfico
      },
    },
  };


  if (loading) return <p>Cargando datos del gráfico de ventas...</p>;
  if (error) return <p>Error al cargar el gráfico de ventas: {error}</p>;
   // Verificar si chartData es null O si existe pero el array de datos está vacío
  if (!chartData || !chartData.datasets || chartData.datasets.length === 0 || chartData.datasets[0].data.length === 0) {
       console.log("No hay datos disponibles para mostrar el gráfico de torta o datasets vacío.");
       return <p>No hay datos de ventas por instrumento disponibles para mostrar el gráfico.</p>;
   }


  // Renderiza el componente Pie chart
  return (
    <div>
      <h2>Reporte de Cantidad Vendida por Instrumento</h2>
       {/* El div contenedor ayuda a controlar el tamaño */}
      <div style={{ width: '50%', margin: 'auto' }}> {/* Ajusta el estilo para el tamaño */}
        {chartData && <Pie data={chartData} options={options} />}
      </div>
    </div>
  );
};

export default CantidadVendidaPorInstrumentoChart;