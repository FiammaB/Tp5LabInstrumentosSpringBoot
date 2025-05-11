import {  Route, Routes } from 'react-router-dom';
import './App.css';
import InstrumentosLista from './components/InstrumentoLista';
import InstrumentoDetalle from './components/IntrumentoDetalle'; // corregí el nombre
import Navbar from './components/Navbar';
import Home from './components/Home';
import DondeEstamos from './components/DondeEstamos';
import Grilla from './components/Grilla';
import Formulario from './components/Formulario';
import { CartProvider } from './context/CarritoContext';
import CartPagina from './components/Cart/pageCarrito'; // Cambié el nombre a "cartPagin" para evitar confusiones
import PagoExitoso from './components/pagoExitoso';
// si es un navbar propio

function App() {
  return (
    <>
     <CartProvider>
      <Navbar /> {/* Navbar visible en todas las páginas */}

      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/instrumento' element={<InstrumentosLista />} />
        <Route path='/detalle/:id' element={<InstrumentoDetalle />} />
        <Route path='/dondeEstamos' element={<DondeEstamos/>} />
        <Route path='/grilla' element={<Grilla/>} />
        <Route path='/Formulario' element={<Formulario/>} />
        <Route path='/cart' element={<CartPagina/>} />
        <Route path='/pago-exitoso' element={<PagoExitoso/>} />
      </Routes>
      </CartProvider>
    </>
  );
}

export default App;
