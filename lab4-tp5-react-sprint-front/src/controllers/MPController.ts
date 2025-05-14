// src/controllers/MPController.ts (Modificar este archivo)
import axios from 'axios';
import { Pedido } from '../models/Pedido'; // Importa el modelo Pedido

// Paso 3: Definir la URL base del endpoint de Mercado Pago en tu backend
const API_URL_MP = 'http://localhost:8080/api/mercadoPago'; // ¡Asegúrate que sea la URL correcta!

// Función para llamar al backend y crear la preferencia de MP
// Ahora, esta función espera que el backend devuelva el ID de la preferencia (string)
export async function createMercadoPagoPreference(pedido: Pedido): Promise<string> { // <--- Retorna Promise<string> (el ID)
    // Endpoint en tu backend para crear la preferencia
    const urlServer = `${API_URL_MP}/crear-preferencia`; // O '/crear-preferencia-inline' si usas otro endpoint

    try {
        console.log("Llamando al backend para crear preferencia MP (Inline Flow) con Objeto Pedido:", pedido);
        // Envía el objeto Pedido completo al backend
        const response = await axios.post(urlServer, pedido, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // *** El backend debe devolver el ID de la preferencia en el cuerpo de la respuesta ***
        // Asumimos que el backend devuelve el ID como un string directamente
        const preferenceId: string = response.data; // <--- Espera el ID string

        console.log("Respuesta del backend (Preference ID):", preferenceId);
        return preferenceId; // Retorna el ID de la preferencia

    } catch (error) {
        console.error("Error al obtener ID de preferencia de Mercado Pago en el frontend (Inline Flow):", error);
        // Manejo de errores mejorado
        if (axios.isAxiosError(error)) {
            // Si es un error de Axios, intenta obtener detalles del response
            throw new Error(`Error de comunicación con backend de MP: ${error.response?.data?.message || error.response?.data || error.message || error.toString()}`);
        } else if (error instanceof Error) {
            // Si es un objeto Error estándar
            throw new Error(`Error interno al preparar pago: ${error.message}`);
        }
        // Otros tipos de errores
        throw new Error("Error desconocido al obtener ID de preferencia de Mercado Pago.");
    }
}

