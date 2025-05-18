import CantidadVendidaPorInstrumentoChart from "./Graficos/CantidadVendidaPorInstrumentoGrafico";
import PedidosPorMesYearChart from "./Graficos/PedidosPorMesAñoChart";

const ReportesGraficos: React.FC = () => {
    return (
      <div className="container mt-4"> {/* Usamos clases de Bootstrap para un contenedor y margen */}
        <h1>Reportes de Pedidos</h1>
        <p>Visualizaciones de datos de pedidos.</p>
  
        {/* Renderiza el componente del gráfico de Pedidos por Mes y Año */}
        <div className="my-3"> {/* Espacio alrededor del gráfico */}
           < PedidosPorMesYearChart/>
        </div>
   {/* --- Renderiza el componente del gráfico de Cantidad Vendida por Instrumento --- */}
   <div className="my-3"> {/* Espacio alrededor del gráfico */}
         <CantidadVendidaPorInstrumentoChart />
      </div>
     
      </div>
    );
  };
  
  export default ReportesGraficos;