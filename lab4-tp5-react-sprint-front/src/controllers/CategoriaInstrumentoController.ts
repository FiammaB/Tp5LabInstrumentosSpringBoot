
import { CategoriaInstrumento } from "../models/CategoriaInstrumento";
const API_URL = "http://localhost:8080/categoria";
class CategoriaInstrumentoController {
    static async obtenerCategorias(): Promise<CategoriaInstrumento[]> {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error("Error al obtener los datos");
        }
        return response.json();
    }
}
export default CategoriaInstrumentoController;