import {  Route, Routes } from 'react-router-dom';
import './App.css';
import InstrumentosLista from './components/InstrumentoLista';
import InstrumentoDetalle from './components/IntrumentoDetalle'; // corregí el nombre
import Navbar from './components/Navbar';
import Home from './components/Home';
import DondeEstamos from './components/DondeEstamos';
import Grilla from './components/Grilla';
import Formulario from './components/Formulario';
// si es un navbar propio

function App() {
  return (
    <>
      <Navbar /> {/* Navbar visible en todas las páginas */}

      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/instrumento' element={<InstrumentosLista />} />
        <Route path='/detalle/:id' element={<InstrumentoDetalle />} />
        <Route path='/dondeEstamos' element={<DondeEstamos/>} />
        <Route path='/grilla' element={<Grilla/>} />
        <Route path='/Formulario' element={<Formulario/>} />
      </Routes>
    </>
  );
}

export default App;
