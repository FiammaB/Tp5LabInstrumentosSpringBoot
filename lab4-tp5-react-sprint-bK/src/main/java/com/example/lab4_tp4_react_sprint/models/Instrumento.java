package com.example.lab4_tp4_react_sprint.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "instrumento")
public class Instrumento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String nombre;
    private String marca;
    private String modelo;
    private String imagen;
    private double precio;
    @Column(name = "costoEnvio")
    private String costoEnvio;
    @Column(name = "cantidadVendida")
    private int cantidadVendida;
    
@Column(length = 1000) // o el tamaño que necesites
private String descripcion;

    @ManyToOne
    @JoinColumn(name = "idCategoria")
    @JsonIgnoreProperties("instrumentos")
    private CategoriaInstrumento categoriaInstrumento;

    // Constructor vacío
    public Instrumento() {}

    // Constructor completo
    public Instrumento(int id, String nombre, String marca, String modelo, String imagen, double precio,
                       String costoEnvio, int cantidadVendida, String descripcion, CategoriaInstrumento categoriaInstrumento) {
        this.id = id;
        this.nombre = nombre;
        this.marca = marca;
        this.modelo = modelo;
        this.imagen = imagen;
        this.precio = precio;
        this.costoEnvio = costoEnvio;
        this.cantidadVendida = cantidadVendida;
        this.descripcion = descripcion;
        this.categoriaInstrumento = categoriaInstrumento;
    }

    // Getters y Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getMarca() { return marca; }
    public void setMarca(String marca) { this.marca = marca; }

    public String getModelo() { return modelo; }
    public void setModelo(String modelo) { this.modelo = modelo; }

    public String getImagen() { return imagen; }
    public void setImagen(String imagen) { this.imagen = imagen; }

    public double getPrecio() { return precio; }
    public void setPrecio(double precio) { this.precio = precio; }

    public String getCostoEnvio() { return costoEnvio; }
    public void setCostoEnvio(String costoEnvio) { this.costoEnvio = costoEnvio; }

    public int getCantidadVendida() { return cantidadVendida; }
    public void setCantidadVendida(int cantidadVendida) { this.cantidadVendida = cantidadVendida; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public CategoriaInstrumento getCategoriaInstrumento() { return categoriaInstrumento; }
    public void setCategoriaInstrumento(CategoriaInstrumento categoriaInstrumento) {
        this.categoriaInstrumento = categoriaInstrumento;
    }
}
