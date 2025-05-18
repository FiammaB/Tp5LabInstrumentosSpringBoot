import { Route, Routes } from 'react-router-dom';
import './App.css';
import InstrumentosLista from './components/InstrumentoLista';
import InstrumentoDetalle from './components/IntrumentoDetalle'; // Asumiendo que el nombre está corregido
import Navbar from './components/Navbar';
import Home from './components/Home';
import DondeEstamos from './components/DondeEstamos';
import Grilla from './components/Grilla';
import Formulario from './components/Formulario';
import { CartProvider } from './context/CarritoContext';
import CartPagina from './components/Cart/pageCarrito';
import PagoExitoso from './components/pagoExitoso';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';

// Inicializar MercadoPago
import { initMercadoPago } from '@mercadopago/sdk-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import ReportesGraficos from './components/ReportesGraficos';
import ReporteExcelPage from './components/ReporteExcel';

// Inicializar el SDK de Mercado Pago
initMercadoPago('APP_USR-f81fff20-b21d-4e06-95fe-b73f6c860319', {
  locale: 'es-AR',
});

function App() {
  return (
    <>
      <CartProvider>
        <Navbar />
        
        <Routes>
          {/* Rutas Públicas */}
          <Route path='/' element={<Home/>} />
          <Route path='/dondeEstamos' element={<DondeEstamos/>} />
          <Route path='/login' element={<Login />} />
          
          {/* Rutas para el carrito - solo para Admin y Operador */}
          <Route 
            path='/cart' 
            element={
              <PrivateRoute requiredRoles={['Admin', 'Operador']}>
                <CartPagina/>
              </PrivateRoute>
            } 
          />
          <Route 
            path='/pago-exitoso' 
            element={
              <PrivateRoute requiredRoles={['Admin', 'Operador']}>
                <PagoExitoso/>
              </PrivateRoute>
            } 
          />
          
          {/* Vista de lista de instrumentos - accesible para Admin, Operador y Visor */}
          <Route
            path='/instrumento'
            element={
              <PrivateRoute requiredRoles={['Admin', 'Operador', 'Visor']}>
                <InstrumentosLista />
              </PrivateRoute>
            }
          />
          
          {/* Detalle de instrumentos - solo para Admin y Operador */}
          <Route
            path='/detalle/:id'
            element={
              <PrivateRoute requiredRoles={['Admin', 'Operador']}>
                <InstrumentoDetalle />
              </PrivateRoute>
            }
          />
          
          {/* Rutas administrativas - solo para Admin */}
          <Route
            path='/grilla'
            element={
              <PrivateRoute requiredRoles={['Admin']}>
                <Grilla />
              </PrivateRoute>
            }
          />
          
          <Route
            path='/Formulario'
            element={
              <PrivateRoute requiredRoles={['Admin']}>
                <Formulario />
              </PrivateRoute>
            }
          />
            {/* --- Ruta para la Página de Reportes de Gráficos --- */}
          {/* Protegida, probablemente solo para Admin u Operador */}
          <Route
            path='/reportes/charts' // Define la ruta
            element={
              // Define qué roles pueden acceder a esta página de reportes
              // Basado en el TP, Admin u Operador parece adecuado
              <PrivateRoute requiredRoles={['Admin']}>
                <ReportesGraficos /> {/* Renderiza la página de reportes */}
              </PrivateRoute>
            }
          />
                    {/* --- Nueva Ruta para la Página de Reporte Excel --- */}
          {/* Protegida, probablemente para los mismos roles que los gráficos */}
          <Route
            path='/reportes/excel' // Define la ruta para el reporte Excel
            element={
              // Define qué roles pueden acceder a esta página de reporte Excel
              <PrivateRoute requiredRoles={['Admin']}> {/* Ajusta los roles */}
                <ReporteExcelPage /> {/* Renderiza la página de reporte Excel */}
              </PrivateRoute>
            }
          />
        </Routes>
      </CartProvider>
    </>
  );
}

export default App;