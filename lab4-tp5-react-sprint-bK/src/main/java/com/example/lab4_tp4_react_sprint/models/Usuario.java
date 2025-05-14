package com.example.lab4_tp4_react_sprint.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;

@Entity
@Table(name = "usuario")
@Data // Genera getters, setters, toString, equals y hashCode con Lombok
@NoArgsConstructor // Genera un constructor sin argumentos con Lombok
@AllArgsConstructor // Genera un constructor con todos los argumentos con Lombok
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true, nullable = false)
    private String nombreUsuario;
    @Column(nullable = false)
    private String clave;
    @Column(nullable = false)
    private String rol ;
}
