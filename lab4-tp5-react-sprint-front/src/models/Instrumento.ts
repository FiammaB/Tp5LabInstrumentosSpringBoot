import { CategoriaInstrumento } from './CategoriaInstrumento';


export class Instrumento {
  id: number;
  nombre: string;
  marca: string;
  modelo: string;
  imagen: string;
  precio: number;
  costoEnvio: string;
  cantidadVendida: number;
  descripcion: string;
  categoriaInstrumento: CategoriaInstrumento;
  // Inicializado como null

  constructor(
    id: number,
    nombre: string,
    marca: string,
    modelo: string,
    imagen: string,
    precio: number,
    costoEnvio: string,
    cantidadVendida: number,
    descripcion: string,
    categoriaInstrumento: CategoriaInstrumento

  ) {
    this.id = id;
    this.nombre = nombre;
    this.marca = marca;
    this.modelo = modelo;
    this.imagen = imagen;
    this.precio = precio;
    this.costoEnvio = costoEnvio;
    this.cantidadVendida = cantidadVendida;
    this.descripcion = descripcion;
    this.categoriaInstrumento = categoriaInstrumento;
  }
}