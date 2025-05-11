import { Instrumento } from './Instrumento';

export class PedidoDetalle {
    id?: number;
    cantidad: number;
    instrumento: Instrumento;
    pedido?: Pedido; // Esta propiedad es opcional en el frontend

    constructor(instrumento: Instrumento, cantidad: number) {
        this.instrumento = instrumento;
        this.cantidad = cantidad;
    }
}

export class Pedido {
    id?: number;
    total_pedido: number;
    detallePedidos: PedidoDetalle[]; // Nombre exacto como en backend
    fecha_pedido: string; // Formato ISO

    constructor(
        total_pedido: number,
        detallePedidos: PedidoDetalle[] = [],
        id?: number,
        fecha_pedido?: string
    ) {
        this.id = id;
        this.total_pedido = total_pedido;
        this.detallePedidos = detallePedidos;
        this.fecha_pedido = fecha_pedido || new Date().toISOString();
    }


    calcularTotal(): void {
        this.total_pedido = this.detallePedidos.reduce((sum, detalle) => {
            return sum + (detalle.instrumento.precio * detalle.cantidad);
        }, 0);
    }
}