import axios from "axios";
import { Pedido } from '../models/Pedido';

const API_URL = "http://localhost:8080/api/pedidos";

export default {
    createPedido: async (
        pedido: Omit<Pedido, "id" | "numeroPedido">
    ): Promise<Pedido> => {
        console.log("Pedido creado:", pedido);
        const response = await axios.post(API_URL, pedido);
        // Log para verificar la respuesta
        console.log("Respuesta del backend:", response.data);
        return response.data;
    },

    getPedidoById: async (id: string): Promise<Pedido> => {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    },

    formatDate: (date: Date): string => {
        return date.toISOString();
    },
};