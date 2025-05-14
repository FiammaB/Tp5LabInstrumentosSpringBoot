package com.example.lab4_tp4_react_sprint.controllers;

import com.example.lab4_tp4_react_sprint.models.Usuario;
import com.example.lab4_tp4_react_sprint.services.UsuarioServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// Clase auxiliar para representar la solicitud de login
// Generalmente se define como una clase estática pública dentro del controlador
// o en un paquete de DTOs. La dejo aquí por simplicidad en este ejemplo.
class LoginRequest {
    private String nombreUsuario;
    private String clave;

    // Getters y Setters (Lombok podría generar estos si lo usas aquí también con @Data)
    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }

    public String getClave() {
        return clave;
    }

    public void setClave(String clave) {
        this.clave = clave;
    }
}


@RestController
@RequestMapping("/api/auth")
public class AuthControlador {

    private final UsuarioServicio usuarioService;
    private final UsuarioServicio usuarioServicio;

    @Autowired
    public AuthControlador(UsuarioServicio usuarioService, UsuarioServicio usuarioServicio) {
        this.usuarioService = usuarioService;
        this.usuarioServicio = usuarioServicio;
    }

    @PostMapping("/login") // Mapea las solicitudes POST a /api/auth/login
    public ResponseEntity<?> loginUsuario(@RequestBody LoginRequest loginRequest) {
        String nombreUsuario = loginRequest.getNombreUsuario();
        String clave = loginRequest.getClave();

        Usuario usuarioAutenticado = usuarioServicio.autenticarUsuario(nombreUsuario, clave);

        if (usuarioAutenticado != null) {
            // Si la autenticación es exitosa, retornamos el usuario
            // Clonamos el usuario para no modificar el original y quitar la clave antes de responder
            Usuario usuarioResponse = new Usuario();
            usuarioResponse.setId(usuarioAutenticado.getId());
            usuarioResponse.setNombreUsuario(usuarioAutenticado.getNombreUsuario());
            usuarioResponse.setRol(usuarioAutenticado.getRol());
            // No incluimos la clave en la respuesta por seguridad

            return ResponseEntity.ok(usuarioResponse); // Retorna 200 OK con los datos del usuario
        } else {
            // Si la autenticación falla, retornamos un estado de error
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario y/o Clave incorrectos, vuelva a intentar");
        }
    }

    // Opcional: Endpoint para registrar un usuario para pruebas iniciales
    // @PostMapping("/register")
    // public ResponseEntity<Usuario> registerUsuario(@RequestBody Usuario nuevoUsuario) {
    //     Usuario usuarioRegistrado = usuarioService.registrarUsuario(nuevoUsuario);
    //     return ResponseEntity.status(HttpStatus.CREATED).body(usuarioRegistrado);
    // }
}