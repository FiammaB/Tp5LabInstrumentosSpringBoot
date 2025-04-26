import { CategoriaInstrumento } from "./CategoriaInstrumento";

export interface Instrumento {
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
}