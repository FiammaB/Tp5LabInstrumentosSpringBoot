import { Instrumento } from './Instrumento';

export interface PedidoDetalle {
    id?: number;
    instrumento: Instrumento;
    cantidad: number;

}

export interface Pedido {
    id?: number;

    fecha_pedido?: string;
    total_pedido: number;
    detalles: PedidoDetalle[];


}
