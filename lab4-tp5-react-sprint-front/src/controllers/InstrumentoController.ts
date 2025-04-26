// src/controllers/InstrumentoController.ts
import { Instrumento } from "../models/Instrumento";

const API_URL = "http://localhost:8080/instrumento";

class InstrumentoController {
  static async obtenerInstrumentos(): Promise<Instrumento[]> {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Error al obtener los datos");
    }
    return response.json();
  }
  static async obtenerInstrumentoPorId(id: number): Promise<Instrumento> {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error("Error al obtener el instrumento");
    }
    return response.json();
  }
  static async crearInstrumento(instrumento: Instrumento): Promise<Instrumento> { 
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(instrumento),
    });
    if (!response.ok) {
      throw new Error("Error al crear el instrumento");
    }
    return response.json();
  }
  static async actualizarInstrumento(instrumento: Instrumento): Promise<Instrumento> {  
    const response = await fetch(`${API_URL}/${instrumento.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(instrumento),
    });
    if (!response.ok) {
      throw new Error("Error al actualizar el instrumento");
    }
    return response.json();
  }
  static async eliminarInstrumento(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Error al eliminar el instrumento");
    }
  }
  static async subirImagen(imagen: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', imagen);
  
    const response = await fetch('http://localhost:8080/upload/imagen', {
      method: 'POST',
      body: formData,
    });
  
    if (!response.ok) {
      throw new Error('Error al subir imagen');
    }
  
    return response.text();
  }
  
  
  // Si después querés agregar más métodos:
  // static async crearInstrumento(data: Instrumento): Promise<Instrumento> { ... }
  // static async eliminarInstrumento(id: number): Promise<void> { ... }
  // etc.
}

export default InstrumentoController;
