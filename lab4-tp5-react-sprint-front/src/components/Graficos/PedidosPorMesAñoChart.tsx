import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2'; // Importa el componente Bar de react-chartjs-2
import { getPedidosCountByMonthAndYear } from '../../controllers/ReportesController'; // Importa la función para obtener los datos
import {
  Chart as ChartJS, // Renombra Chart para evitar conflictos
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'; // Importa los componentes necesarios de Chart.js

// Registrar los componentes de Chart.js que vamos a usar
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
type PedidoDataBackend = [number, number, number]; // [year, month, count]

// Esta es la estructura que setChartData DEBE recibir (o null)
interface ChartJsData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string;
        borderColor: string;
        borderWidth: number;
    }[];
}
const PedidosPorMesYearChart: React.FC = () => {
  const [chartData, setChartData] = useState<ChartJsData| null>(null);// any me da error 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchAndProcessData = async () => { // Renombrada la función
      try {
        // --- Llama a la función del servicio en lugar de hacer fetch aquí ---
        const data: PedidoDataBackend[] = await getPedidosCountByMonthAndYear(); // Usa el servicio
        // se asegura q data sea un array
        if (!Array.isArray(data)) {
            console.error("API response is not an array:", data);
            setError("Formato de datos inesperado de la API.");
            setLoading(false);
            setChartData(null); // Establecer a null en caso de formato incorrecto
            return; // Salir del effect
       }
        // --- Procesar los datos recibidos del servicio ---
        // (Esta lógica sigue aquí porque es específica de cómo el gráfico necesita los datos)
        const labels = data.map(item => {
            return `${item[1]}/${item[0]}`; // item[1] es el mes, item[0] es el año
        });

        const counts = data.map(item => {
            return item[2]; // item[2] es el conteo
        });

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Cantidad de Pedidos',
              data: counts,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });

        setLoading(false);

      } catch (err: unknown) {
        console.error("Error fetching and processing chart data:", err);
        setError( `Error al cargar los datos del gráfico. ${err}`);
        setLoading(false);
      }
    };

    fetchAndProcessData(); // Llama a la función

  }, []);

  // Opciones de configuración para el gráfico
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Cantidad de Pedidos por Mes y Año',
      },
    },
     scales: {
        y: {
            beginAtZero: true,
            title: {
                display: true,
                text: 'Cantidad de Pedidos'
            }
        },
        x: {
            title: {
                display: true,
                text: 'Mes / Año'
            }
        }
    }
  };


  if (loading) return <p>Cargando datos del gráfico...</p>;
  if (error) return <p>Error al cargar el gráfico: {error}</p>;
  if (!chartData || chartData.labels.length === 0) return <p>No hay datos disponibles para mostrar el gráfico.</p>;//Property 'labels' does not exist on type '{}'.ts(2339)
  


  return (
    <div>
      <h2>Reporte de Pedidos por Mes y Año</h2>
      <div style={{ width: '60%', margin: 'auto' }}>
        {chartData && <Bar data={chartData} options={options} />}
      </div>
    </div>
  );
};

export default PedidosPorMesYearChart;