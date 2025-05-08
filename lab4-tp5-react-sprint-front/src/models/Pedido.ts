import { Instrumento } from './Instrumento';

export class PedidoDetalle {
    id?: number;
    instrumento: Instrumento;
    cantidad: number;

    constructor(instrumento: Instrumento, cantidad: number, id?: number) {
        this.id = id;
        this.instrumento = instrumento;
        this.cantidad = cantidad;
    }
}

export class Pedido {
    id?: number;
    fecha_pedido?: string;
    total_pedido: number;
    detalles: PedidoDetalle[];

    constructor(total_pedido: number, detalles: PedidoDetalle[], id?: number, fecha_pedido?: string) {
        this.id = id;
        this.fecha_pedido = fecha_pedido;
        this.total_pedido = total_pedido;
        this.detalles = detalles;
    }

    // Método helper para añadir un detalle
    addDetalle(detalle: PedidoDetalle): void {
        this.detalles.push(detalle);
    }

    // Método para calcular el total del pedido
    calcularTotal(): number {
        this.total_pedido = this.detalles.reduce((sum, detalle) => {
            const precio = detalle.instrumento.precio || 0;
            const costoEnvio = detalle.instrumento.costoEnvio === "G" ? 0 :
                Number(detalle.instrumento.costoEnvio) || 0;
            return sum + (precio + costoEnvio) * detalle.cantidad;
        }, 0);

        return this.total_pedido;
    }
}