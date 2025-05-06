package com.example.lab4_tp4_react_sprint.services;

import com.example.lab4_tp4_react_sprint.DAO.PedidoDAO;
import com.example.lab4_tp4_react_sprint.models.DetallePedido;
import com.example.lab4_tp4_react_sprint.models.Pedido;
import com.example.lab4_tp4_react_sprint.models.Instrumento;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class PedidoServicio {

    @Autowired
    private PedidoDAO pedidoRepository;

    @Autowired
    private InstrumentoServicio instrumentoService;

    @Transactional
    public Pedido savePedido(Pedido pedido) {
        // Configurar correctamente la relación bidireccional
        List<DetallePedido> detalles = new ArrayList<>(pedido.getDetallePedidos());
        pedido.getDetallePedidos().clear();

        // Guardar el pedido primero para obtener un ID
        Pedido pedidoGuardado = pedidoRepository.save(pedido);

        // Ahora procesar cada detalle y vincularlo al pedido
        for (DetallePedido detalle : detalles) {
            // Obtener el instrumento completo de la base de datos
            Instrumento instrumento = instrumentoService.getInstrumentoById(detalle.getInstrumento().getId());

            // Configurar el detalle correctamente
            detalle.setInstrumento(instrumento);
            detalle.setPedido(pedidoGuardado);

            // Usar el método helper para mantener la relación bidireccional
            pedidoGuardado.agregarDetalle(detalle);
        }

        // Calcular el total si es necesario (aunque debería venir del frontend)
        if (pedidoGuardado.getTotal_pedido() <= 0) {
            pedidoGuardado.calcularTotal();
        }

        // Guardar todo el pedido con sus detalles
        return pedidoRepository.save(pedidoGuardado);
    }
}