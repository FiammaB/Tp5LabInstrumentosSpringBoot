package com.example.lab4_tp4_react_sprint.controllers;



import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@RestController
@RequestMapping("/upload")
@CrossOrigin(origins = "http://localhost:3000") // Permití el acceso desde tu frontend React
public class UploadController {

    // Ruta al directorio 'public/img' de tu frontend (ajustá si es necesario)
    private final String FRONT_IMG_DIR = "../lab4-tp5-react-sprint-front/public/img";

    @PostMapping("/imagen")
    public ResponseEntity<String> uploadImagen(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Archivo vacío");
            }

            // Generar nombre único para evitar conflictos
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();

            // Crear ruta de destino
            Path rutaArchivo = Paths.get(FRONT_IMG_DIR).resolve(fileName);

            // Guardar archivo
            Files.copy(file.getInputStream(), rutaArchivo, StandardCopyOption.REPLACE_EXISTING);

            // Devolver el nombre del archivo (para guardar en la base de datos)
            return ResponseEntity.ok(fileName);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al subir la imagen: " + e.getMessage());
        }
    }
}
