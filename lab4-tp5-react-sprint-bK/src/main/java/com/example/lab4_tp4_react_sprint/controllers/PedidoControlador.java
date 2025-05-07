package com.example.lab4_tp4_react_sprint.controllers;

import com.example.lab4_tp4_react_sprint.models.Pedido;
import com.example.lab4_tp4_react_sprint.services.PedidoServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class PedidoControlador {
    @Autowired
    private PedidoServicio pedidoService;

    @PostMapping("/pedidos")
    public ResponseEntity<?> savePedido(@RequestBody Pedido pedido) {
        try {
            // Spring Boot automáticamente deserializa el JSON a un objeto Pedido
            // junto con sus detalles, siempre que las propiedades coincidan

            // Asegurar que las relaciones bidireccionales estén configuradas
            pedido.getDetallePedidos().forEach(detalle -> detalle.setPedido(pedido));

            // Guardar el pedido
            Pedido savedPedido = pedidoService.savePedido(pedido);
            return ResponseEntity.ok(savedPedido);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error al procesar el pedido: " + e.getMessage());
        }
    }
}