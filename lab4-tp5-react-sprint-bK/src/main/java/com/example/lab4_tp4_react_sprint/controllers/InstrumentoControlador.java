package com.example.lab4_tp4_react_sprint.controllers;

import com.example.lab4_tp4_react_sprint.models.Instrumento;
import com.example.lab4_tp4_react_sprint.services.InstrumentoServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.expression.spel.ast.OpAnd;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("instrumento")
public class InstrumentoControlador {
    @Autowired
    private InstrumentoServicio intrumentoServicio;

    @GetMapping

    public List<Instrumento> getUsers(){
        return this.intrumentoServicio.getInstrumento();

    }
    @PostMapping
    public Instrumento saveInstrumento(@RequestBody Instrumento instrumento){
        return this.intrumentoServicio.saveInstrumento(instrumento);
    }

    @GetMapping(path = "/{id}")
    public Optional<Instrumento> getInstrumentoById(@PathVariable int id){
        return this.intrumentoServicio.getById(id);
    }
    @PutMapping(path = "/{id}")
    public Instrumento updateInstrumentoById(@RequestBody Instrumento instrumento, @PathVariable("id") int id){
        return this.intrumentoServicio.updateById(instrumento, id);
    }
    @DeleteMapping(path = "/{id}")
    public String deleteById (@PathVariable("id") int id){
        boolean ok = this.intrumentoServicio.deleteInstrumento(id);
        if(ok){
            return "El instrumento a sido eliminado correctamente";
        }else {
            return "Error al eliminar el Intrumento";
        }
    }
}

