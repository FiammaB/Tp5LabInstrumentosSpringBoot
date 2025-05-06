package com.example.lab4_tp4_react_sprint.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.List;


    @Entity
    @Table(name = "pedido_detalle")
    public class DetallePedido {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private int cantidad;

        @ManyToOne
        @JoinColumn(name = "id_instrumento")  // ← Nombre real en la BD
        private Instrumento instrumento;
        @JsonIgnore
        @ManyToOne
        @JoinColumn(name = "id_pedido")  // ← Nombre real en la BD
        private Pedido pedido;

        // Getters y setters...


        public DetallePedido() {
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public int getCantidad() {
            return cantidad;
        }

        public void setCantidad(int cantidad) {
            this.cantidad = cantidad;
        }

        public Instrumento getInstrumento() {
            return instrumento;
        }

        public void setInstrumento(Instrumento instrumento) {
            this.instrumento = instrumento;
        }

        public Pedido getPedido() {
            return pedido;
        }

        public void setPedido(Pedido pedido) {
            this.pedido = pedido;
        }
    }