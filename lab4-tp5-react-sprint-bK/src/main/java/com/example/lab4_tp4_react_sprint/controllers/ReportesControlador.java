package com.example.lab4_tp4_react_sprint.controllers;

import com.example.lab4_tp4_react_sprint.services.ReportesServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("api/reportes")
public class ReportesControlador {
    private final ReportesServices reportesService;

    @Autowired
    public ReportesControlador(ReportesServices reportesService) {
        this.reportesService = reportesService;
    }

    // --- Endpoint para obtener cantidad de pedidos por mes y año (Sin DTO) ---
    // Ahora devuelve directamente List<Object[]>
    @GetMapping("/pedidos-por-mes-año")
    public ResponseEntity<List<Object[]>> getPedidosCountByMonthAndYear() {
        List<Object[]> reportData = reportesService.getPedidosCountByMonthAndYear();
        // Spring Boot convertirá automáticamente List<Object[]> a un JSON Array de Arrays
        return ResponseEntity.ok(reportData); // Retorna la lista de Object[] con estado 200 OK
    }


    // --- Nuevo endpoint para obtener la cantidad total vendida por instrumento ---
    // Posiblemente quieras proteger este endpoint con seguridad
    @GetMapping("/cantidad-vendida-por-instrumento")
    public ResponseEntity<List<Object[]>> getCantidadVendidaByInstrumento() {
        List<Object[]> reportData = reportesService.getCantidadVendidaByInstrumento();
        // Spring Boot convertirá automáticamente List<Object[]> a un JSON Array de Arrays
        return ResponseEntity.ok(reportData); // Retorna la lista de Object[] con estado 200 OK
    }


    // --- Nuevo endpoint para generar y descargar el reporte Excel ---

    @GetMapping("/excel-pedidos")
    public ResponseEntity<byte[]> downloadExcelReport(

            @RequestParam("fechaDesde") String fechaDesdeStr,
            @RequestParam("fechaHasta") String fechaHastaStr
            // Si quieres recibir directamente como Date, necesitas un configurador para Spring Boot
    ) {
        try {

            java.text.SimpleDateFormat formatter = new java.text.SimpleDateFormat("yyyy-MM-dd"); // Ajusta el formato
            Date fechaDesde = formatter.parse(fechaDesdeStr);
            Date fechaHasta = formatter.parse(fechaHastaStr);
            // --------------------------------------------------------------------

            // 1. Llamar al servicio para generar el reporte Excel como byte[]
            byte[] excelContent = reportesService.generarExcelReport(fechaDesde, fechaHasta);

            //config encabesados
            HttpHeaders headers = new HttpHeaders();

            headers.setContentType(MediaType.valueOf("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));

            headers.setContentDispositionFormData("attachment", "ReportePedidos.xlsx");

            headers.setContentLength(excelContent.length);

            // 3. Devolver el contenido del archivo en la respuesta
            return new ResponseEntity<>(excelContent, headers, HttpStatus.OK);

        } catch (IOException e) {

            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (java.text.ParseException e) {

            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // Retornar un error 400 si el formato de fecha es incorrecto
        }
    }

    @GetMapping("/instrumento-pdf/{id}") // Define el endpoint con el ID del instrumento como PathVariable
    public ResponseEntity<byte[]> downloadInstrumentoPdf(@PathVariable("id") int id) { // Captura el ID de la URL

        try {
            // 1. Llamar al servicio para generar el reporte PDF como byte[]
            // Tu servicio lanza RuntimeException si no encuentra el instrumento o IOException si falla la generación
            byte[] pdfContent = reportesService.generateInstrumentoPdf(id);

            // 2. Configurar los encabezados de la respuesta para la descarga del archivo
            HttpHeaders headers = new HttpHeaders();
            // Tipo de contenido para archivos PDF
            headers.setContentType(MediaType.APPLICATION_PDF);
            // Nombre del archivo para la descarga
            headers.setContentDispositionFormData("attachment", "ficha_tecnica_instrumento_" + id + ".pdf"); // Nombre sugerido con el ID
            // Tamaño del archivo
            headers.setContentLength(pdfContent.length);

            // 3. Devolver el contenido del archivo en la respuesta
            return new ResponseEntity<>(pdfContent, headers, HttpStatus.OK);

        } catch (RuntimeException e) {
            // Capturar la RuntimeException lanzada por el servicio si el instrumento no se encuentra
            System.err.println("Instrumento no encontrado al generar PDF: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND); // Retornar 404 Not Found aca me sale el error q cambio
        } catch (IOException e) {
            // Capturar errores en la generación del PDF (ej. loguear el error)
            System.err.println("Error de IO al generar PDF para instrumento " + id + ": " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); // Retornar un error 500
        } catch (Exception e) {
            // Capturar cualquier otra excepción inesperada
            System.err.println("Error inesperado al generar PDF para instrumento " + id + ": " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}