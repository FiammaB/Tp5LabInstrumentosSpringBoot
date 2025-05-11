// src/controllers/MPController.ts
import axios from 'axios';
import { Pedido } from '../models/Pedido'; // Importar el modelo Pedido

const API_URL_MP = 'http://localhost:8080/api/mercadoPago';

// La función ahora recibe el objeto Pedido completo
export async function createMercadoPagoPreference(pedido: Pedido): Promise<string> {
    const urlServer = `${API_URL_MP}/crear-preferencia`;

    try {
        console.log("Llamando al backend para crear preferencia MP con Objeto Pedido:", pedido);
        // Enviar el objeto Pedido completo en el body de la solicitud
        const response = await axios.post(urlServer, pedido, { // <- Enviamos el objeto 'pedido'
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const initPoint: string = response.data;
        console.log("Respuesta del backend (init_point):", initPoint);
        return initPoint;

    } catch (error) {
        console.error("Error al crear la preferencia de Mercado Pago en el frontend:", error);
        if (axios.isAxiosError(error)) {
            throw new Error(`Error de comunicación con backend de MP: ${error.response?.data || error.message}`);
        }
        throw new Error("Error desconocido al crear preferencia de Mercado Pago.");
    }
}
