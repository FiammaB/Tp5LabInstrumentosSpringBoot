import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Instrumento } from '../models/Instrumento';
import { CategoriaInstrumento } from '../models/CategoriaInstrumento';
import './Formulario.css';
import CategoriaInstrumentoController from '../controllers/CategoriaInstrumentoController';
import InstrumentoController from '../controllers/InstrumentoController';

const Formulario: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const instrumentoEditar = location.state as Instrumento | null;

  const [nombre, setNombre] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [imagen, setImagen] = useState<File | null>(null);
  const [precio, setPrecio] = useState<string>('');  // Se maneja como cadena vacía
  const [costoEnvio, setCostoEnvio] = useState('');
  const [cantidadVendida, setCantidadVendida] = useState<string>('');  // Se maneja como cadena vacía
  const [descripcion, setDescripcion] = useState('');
  const [categorias, setCategorias] = useState<CategoriaInstrumento[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number | string>('');

  useEffect(() => {
    CategoriaInstrumentoController.obtenerCategorias()
      .then(setCategorias)
      .catch((error) => console.error('Error al cargar categorías:', error));
  }, []);

  useEffect(() => {
    if (instrumentoEditar) {
      setNombre(instrumentoEditar.nombre);
      setMarca(instrumentoEditar.marca);
      setModelo(instrumentoEditar.modelo);
      setPrecio(instrumentoEditar.precio.toString());
      setCostoEnvio(instrumentoEditar.costoEnvio);
      setCantidadVendida(instrumentoEditar.cantidadVendida.toString());
      setDescripcion(instrumentoEditar.descripcion);
      setCategoriaSeleccionada(instrumentoEditar.categoriaInstrumento?.id);
    }
  }, [instrumentoEditar]);

  const handleCategoriaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoriaSeleccionada(event.target.value);
  };

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImagen(e.target.files[0]);
    }
  };

  const handlePrecioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrecio(e.target.value);
  };

  const handleCantidadVendidaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCantidadVendida(e.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    let nombreImagen = instrumentoEditar?.imagen || '';

    if (imagen) {
      try {
        nombreImagen = await InstrumentoController.subirImagen(imagen);
      } catch (error) {
        console.error('Error subiendo imagen:', error);
        alert('Error al subir imagen');
        return;
      }
    }

    const instrumentoFinal: Instrumento = {
      id: instrumentoEditar?.id || 0,
      nombre: nombre,
      marca,
      modelo,
      imagen: nombreImagen,
      precio: precio ? Number(precio) : 0,  // Se convierte a número si no está vacío
      costoEnvio,
      cantidadVendida: cantidadVendida ? Number(cantidadVendida) : 0,  // Se convierte a número si no está vacío
      descripcion,
      categoriaInstrumento: {
        id: Number(categoriaSeleccionada),
        denominacion:
          categorias.find((cat) => cat.id === Number(categoriaSeleccionada))?.denominacion || '',
      },
    };

    try {
      if (instrumentoEditar) {
        await InstrumentoController.actualizarInstrumento(instrumentoFinal);
        alert('Instrumento modificado con éxito');
      } else {
        await InstrumentoController.crearInstrumento(instrumentoFinal);
        alert('Instrumento creado con éxito');
      }
      navigate('/');
    } catch (error) {
      console.error('Error guardando instrumento:', error);
      alert('Error al guardar el instrumento');
    }
  };

  return (
    <div className="container mt-5">
      <h2>{instrumentoEditar ? 'Editar Instrumento' : 'Formulario para Cargar Instrumento'}</h2>
      <form  onSubmit={handleSubmit}>
        <div  className="mb-3">
          <label  htmlFor="nombre" className="form-label">Nombre:</label>
          <input type="text" className="form-control"  id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </div>

        <div  className="mb-3">
          <label htmlFor="marca" className="form-label">Marca:</label>
          <input type="text"className="form-control"  id="marca" value={marca} onChange={(e) => setMarca(e.target.value)} required />
        </div>

        <div  className="mb-3">
          <label htmlFor="modelo" className="form-label">Modelo:</label>
          <input type="text" className="form-control"  id="modelo" value={modelo} onChange={(e) => setModelo(e.target.value)} required />
        </div>

        <div  className="mb-3">
          <label htmlFor="imagen" className="form-label">Imagen:</label>
          <input type="file"className="form-control"  id="imagen" accept="image/*" onChange={handleImagenChange} />
          {instrumentoEditar?.imagen && (
            <div className="imagen-preview">
              <p>Imagen actual:</p>
              <img src={`/img/${instrumentoEditar.imagen}`} alt="Imagen actual" width="150" />
            </div>
          )}
        </div>

        <div  className="mb-3">
          <label htmlFor="precio" className="form-label">Precio:</label>
          <input type="number"className="form-control"  id="precio" value={precio} onChange={handlePrecioChange} required />
        </div>

        <div className="mb-3">
          <label htmlFor="costoEnvio" className="form-label">Costo Envío:</label>
          <input
            type="text"
            className="form-control" 
            id="costoEnvio"
            value={costoEnvio}
            onChange={(e) => {
              const valor = e.target.value;
              if (/^(\d*\.?\d*|G)$/i.test(valor)) {
                setCostoEnvio(valor.toUpperCase());
              }
            }}
            placeholder="Ej: G o 1500"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="cantidadVendida"  className="form-label">Cantidad Vendida:</label>
          <input
            type="number"
            className="form-control" 
            id="cantidadVendida"
            value={cantidadVendida}
            onChange={handleCantidadVendidaChange}
            required
          />
        </div>

        <div className="mb-3" >
          <label htmlFor="descripcion" className="form-label">Descripción:</label>
          <textarea id="descripcion" className="form-control"  value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
        </div>

        <div  className="mb-3">
          <label htmlFor="categoria" className="form-label">Categoría del Instrumento:</label>
          <select id="categoria" className="form-control" value={categoriaSeleccionada} onChange={handleCategoriaChange} required>
            <option value="">Seleccione una categoría</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.denominacion}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-secondary">{instrumentoEditar ? 'Actualizar Instrumento' : 'Guardar Instrumento'}</button>
      </form>
    </div>
  );
};

export default Formulario;
