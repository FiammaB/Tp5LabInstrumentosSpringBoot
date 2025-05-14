package com.example.lab4_tp4_react_sprint.services;

import com.example.lab4_tp4_react_sprint.DAO.UsuarioDAO;
import com.example.lab4_tp4_react_sprint.models.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Optional;

@Service
public class UsuarioServicio {
    private UsuarioDAO usuarioRepository;

    @Autowired
    public UsuarioServicio(UsuarioDAO usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }
    //encriptar Clave
    private  String encriptarClave(String clave) {
        try{
            MessageDigest digest= MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(clave.getBytes(StandardCharsets.UTF_8));
            //base64 convierte el array de bytes en una repersentacion base64 se usa por su simplicidad
            return Base64.getEncoder().encodeToString(hash);
        }catch (NoSuchAlgorithmException e){
            e.printStackTrace();
            return null;
        }
    }
    //autenicación
    // En UsuarioService.java

    public Usuario autenticarUsuario(String nombreUsuario, String clave) {
        System.out.println("Intentando autenticar usuario: " + nombreUsuario); // Log 1


        Usuario usuario = usuarioRepository.findByNombreUsuario(nombreUsuario);

        if (usuario != null) {
            System.out.println("Usuario encontrado: " + usuario.getNombreUsuario()); // Log 2
            String claveEncriptadaAlmacenada = usuario.getClave();
            String claveIngresadaEncriptada = encriptarClave(clave);

            System.out.println("Clave Almacenada (Encriptada): " + claveEncriptadaAlmacenada); // Log 3
            System.out.println("Clave Ingresada (Encriptada): " + claveIngresadaEncriptada); // Log 4

            // Compara la clave ingresada (después de encriptarla) con la clave almacenada
            if (claveEncriptadaAlmacenada != null && claveIngresadaEncriptada != null &&
                    claveEncriptadaAlmacenada.equals(claveIngresadaEncriptada)) {
                System.out.println("Comparación de clave exitosa. Autenticación OK."); // Log 5
                return usuario; // Las credenciales son correctas, retorna el usuario
            } else {
                System.out.println("Comparación de clave fallida."); // Log 6
            }
        } else {
            System.out.println("Usuario NO encontrado en la base de datos."); // Log 7
        }

        // Si el usuario no se encontró o la clave no coincide
        System.out.println("Autenticación fallida para el usuario: " + nombreUsuario); // Log 8
        return null; // Indica autenticación fallida
    }
    // Método para obtener un usuario por ID (útil para verificar roles en rutas protegidas)
    public Optional<Usuario> obtenerUsuarioPorId(Long id) {
        return usuarioRepository.findById(id);
    }
}
