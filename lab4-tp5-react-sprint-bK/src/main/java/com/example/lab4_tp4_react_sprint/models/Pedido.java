package com.example.lab4_tp4_react_sprint.models;

import jakarta.persistence.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "pedido")
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Temporal(TemporalType.TIMESTAMP)
    private Date fecha_pedido;
    private double total_pedido;
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL,orphanRemoval = true)
    private List<DetallePedido> detallePedidos= new ArrayList<>();


    public Pedido() {
    }


    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Date getFecha_pedido() {
        return fecha_pedido;
    }

    public void setFecha_pedido(Date fecha_pedido) {
        this.fecha_pedido = fecha_pedido;
    }

    public double getTotal_pedido() {
        return total_pedido;
    }

    public void setTotal_pedido(double total_pedido) {
        this.total_pedido = total_pedido;
    }

    public List<DetallePedido> getDetallePedidos() {
        return detallePedidos;
    }

    public void setDetallePedidos(List<DetallePedido> detallePedidos) {
        this.detallePedidos = detallePedidos;
    }
    // Método para calcular el total del pedido
    public void calcularTotal() {
        this.total_pedido = detallePedidos.stream()
                .mapToDouble(detalle -> {
                    Double precio = detalle.getInstrumento().getPrecio();
                    return (precio != null ? precio : 0) * detalle.getCantidad();
                })
             .sum();
}
    // Método helper para la relación bidireccional
    public void agregarDetalle(DetallePedido detalle) {
        this.detallePedidos.add(detalle);
        detalle.setPedido(this);
    }
}
