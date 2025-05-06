package com.example.lab4_tp4_react_sprint.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "categoria")
public class CategoriaInstrumento {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;



    private String denominacion;
    @OneToMany(mappedBy = "categoriaInstrumento", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("categoriaInstrumento")
    private List<Instrumento> instrumentos;

    public List<Instrumento> getInstrumentos() {
        return instrumentos;
    }

    public void setInstrumentos(List<Instrumento> instrumentos) {
        this.instrumentos = instrumentos;
    }

    public CategoriaInstrumento() {

    }

    public CategoriaInstrumento(int id, String denominacion) {
        this.id = id;
        this.denominacion = denominacion;
    }

    public String getDenominacion() {
        return denominacion;
    }

    public void setDenominacion(String denominacion) {
        this.denominacion = denominacion;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
}
