// com.example.lab4_tp4_react_sprint.controllers.MercadoPagoControlador.java
package com.example.lab4_tp4_react_sprint.controllers;

// No necesitamos PedidoDAO.findById si recibimos el objeto completo
// import com.example.lab4_tp4_react_sprint.DAO.PedidoDAO;
import com.example.lab4_tp4_react_sprint.models.DetallePedido;
import com.example.lab4_tp4_react_sprint.models.Pedido;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.preference.Preference;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
// No necesitamos importar Map si recibimos Pedido directamente
// import java.util.Map;

@RestController
@RequestMapping("/api/mercadoPago")
@CrossOrigin(origins = "http://localhost:5173") // Asegúrate que este es el puerto de tu frontend
public class MercadoPagoControlador {

    // Ya no inyectamos PedidoDAO si no vamos a buscar el pedido
    // @Autowired
    // private PedidoDAO pedidoDAO;

    // ¡REEMPLAZAR CON TU ACCESS TOKEN DE PRODUCCIÓN O SANDBOX!
    private static final String ACCESS_TOKEN = "APP_USR-4754437273609325-050817-9cc23559f03b64ae71bae0474412a9db-2427399927";

    @PostMapping("/crear-preferencia")
    // Recibir el objeto Pedido completo en el cuerpo de la solicitud
    public ResponseEntity<?> crearPreferencia(@RequestBody Pedido pedido) { // <- Recibimos el objeto 'pedido'
        try {
            // Validar que el pedido y sus detalles no sean nulos y tengan la información mínima necesaria
            if (pedido == null || pedido.getDetallePedidos() == null || pedido.getDetallePedidos().isEmpty()) {
                return ResponseEntity.badRequest().body("El objeto Pedido o sus detalles están vacíos.");
            }
            // Opcional: Puedes añadir validaciones adicionales aquí, como verificar que el ID del pedido recibido no sea 0 o null

            // Configurar el Access Token de Mercado Pago
            MercadoPagoConfig.setAccessToken(ACCESS_TOKEN);

            // Crear la lista de items para la preferencia de MP usando los detalles del Pedido recibido
            List<PreferenceItemRequest> items = new ArrayList<>();
            for (DetallePedido detalle : pedido.getDetallePedidos()) {
                // Validar detalle antes de crear el item
                if (detalle.getInstrumento() == null || detalle.getInstrumento().getNombre() == null || detalle.getCantidad() <= 0 || detalle.getInstrumento().getPrecio() == 0) {
                    System.err.println("Advertencia: Detalle de pedido inválido encontrado. Se omite. ID Instrumento: " + (detalle.getInstrumento() != null ? detalle.getInstrumento().getId() : "N/A"));
                    continue; // Saltar este detalle si no es válido
                }

                PreferenceItemRequest item = PreferenceItemRequest.builder()
                        .id(String.valueOf(detalle.getInstrumento().getId())) // Usar el ID del instrumento del Pedido recibido
                        .title(detalle.getInstrumento().getNombre()) // Usar el nombre del instrumento
                        .quantity(detalle.getCantidad()) // Usar la cantidad
                        .unitPrice(BigDecimal.valueOf(detalle.getInstrumento().getPrecio())) // Usar el precio unitario
                        .currencyId("ARS")
                        .build();
                items.add(item);

            }

            if (items.isEmpty()) {
                return ResponseEntity.badRequest().body("Ningún item válido encontrado en los detalles del pedido para crear la preferencia.");
            }


            // Configurar las URLs de redirección después del pago
            PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                    .success("https://localhost:5173/pago-exitoso")
                    .pending("https://localhost:5173/pago-pendiente")
                    .failure("https://localhost:5173/pago-fallido")
                    .build();

            // Construir la solicitud de preferencia
            PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                    .items(items)
                    .backUrls(backUrls)
                    // Opcional pero MUY RECOMENDABLE: Asignar el ID de tu pedido como referencia externa
                    // Esto te permitirá identificar el pago de MP con tu pedido interno.
                    // Asegúrate de que el Pedido recibido tenga un ID válido si ya fue guardado previamente.
                    .externalReference(String.valueOf(pedido.getId()))
                    .build();


            // Crear la preferencia utilizando el cliente de Mercado Pago
            PreferenceClient client = new PreferenceClient();
            Preference preference = client.create(preferenceRequest);

            // Devolver solo el init_point (URL de la página de pago de Mercado Pago)
            return ResponseEntity.ok(preference.getId());

        } catch (MPException | MPApiException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al generar preferencia de Mercado Pago: " + e.getMessage());
        } catch (Exception e) {
            // Capturar cualquier otra excepción inesperada
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error inesperado en el servidor: " + e.getMessage());
        }
    }
}