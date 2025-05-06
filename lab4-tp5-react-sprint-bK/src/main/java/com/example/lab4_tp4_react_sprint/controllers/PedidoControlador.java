package com.example.lab4_tp4_react_sprint.controllers;

import com.example.lab4_tp4_react_sprint.models.DetallePedido;
import com.example.lab4_tp4_react_sprint.models.Instrumento;
import com.example.lab4_tp4_react_sprint.models.Pedido;
import com.example.lab4_tp4_react_sprint.services.PedidoServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class PedidoControlador {
    @Autowired
    private PedidoServicio pedidoService;

    @PostMapping("/pedidos")
    public ResponseEntity<?> savePedido(@RequestBody Map<String, Object> payload) {
        try {
            // Crear nuevo pedido
            Pedido pedido = new Pedido();

            // Procesar fecha
            String fechaStr = (String) payload.get("fecha_pedido");
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
            Date fecha = dateFormat.parse(fechaStr);
            pedido.setFecha_pedido(fecha);

            // Establecer total
            double total = Double.parseDouble(payload.get("total_pedido").toString());
            pedido.setTotal_pedido(total);

            // Procesar detalles
            List<Map<String, Object>> detallesJson = (List<Map<String, Object>>) payload.get("detalles");
            List<DetallePedido> detalles = new ArrayList<>();

            for (Map<String, Object> detalleJson : detallesJson) {
                DetallePedido detalle = new DetallePedido();

                // Extraer cantidad
                int cantidad = Integer.parseInt(detalleJson.get("cantidad").toString());
                detalle.setCantidad(cantidad);

                // Extraer instrumento
                Map<String, Object> instrumentoJson = (Map<String, Object>) detalleJson.get("instrumento");
                Instrumento instrumento = new Instrumento();
                instrumento.setId(Integer.parseInt(instrumentoJson.get("id").toString()));

                // Configurar la relación
                detalle.setInstrumento(instrumento);
                detalles.add(detalle);
            }

            // Configurar la relación bidireccional
            for (DetallePedido detalle : detalles) {
                pedido.agregarDetalle(detalle);
            }

            // Guardar el pedido
            Pedido savedPedido = pedidoService.savePedido(pedido);
            return ResponseEntity.ok(savedPedido);
        } catch (ParseException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error en el formato de fecha: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error al procesar el pedido: " + e.getMessage());
        }
    }
}