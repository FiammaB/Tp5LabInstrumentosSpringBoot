package com.example.lab4_tp4_react_sprint.controllers;

import com.example.lab4_tp4_react_sprint.models.CategoriaInstrumento;
import com.example.lab4_tp4_react_sprint.services.CategoriaInstrumentoServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.expression.spel.ast.OpAnd;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Optional;

@RestController
@RequestMapping("/categoria")
public class CategoriaInstrumentoCotrolador {
    @Autowired
    private CategoriaInstrumentoServicio intrumentoServicio;

    @GetMapping

    public ArrayList<CategoriaInstrumento> getUsers(){
        return this.intrumentoServicio.getCategoriaInstrumento();

    }
    @PostMapping
    public CategoriaInstrumento saveCategoriaInstrumento(@RequestBody CategoriaInstrumento CategoriaInstrumento){
        return this.intrumentoServicio.saveCategoriaInstrumento(CategoriaInstrumento);
    }

    @GetMapping(path = "/{id}")
    public Optional<CategoriaInstrumento> getCategoriaInstrumentoById(@PathVariable int id){
        return this.intrumentoServicio.getById(id);
    }

}
