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
        </Routes>
      </CartProvider>
    </>
  );
}

export default App;