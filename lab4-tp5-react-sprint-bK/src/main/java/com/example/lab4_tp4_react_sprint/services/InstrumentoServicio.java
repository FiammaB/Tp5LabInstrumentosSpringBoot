package com.example.lab4_tp4_react_sprint.services;

import com.example.lab4_tp4_react_sprint.DAO.InstrumentoDAO;
import com.example.lab4_tp4_react_sprint.models.Instrumento;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;

@Service
public class InstrumentoServicio {
    @Autowired
    InstrumentoDAO instrumentoDAO;
    public List<Instrumento> getInstrumento(){
        return (List<Instrumento>) instrumentoDAO.findAll();
    }

    public Instrumento saveInstrumento (Instrumento intrumento){
        return instrumentoDAO.save(intrumento);
    }

    public Optional<Instrumento> getById(int id){
        return instrumentoDAO.findById(id);
    }
    public Instrumento updateById(Instrumento request, int id) {
        Optional<Instrumento> optionalInstrumento = instrumentoDAO.findById(id);
        if (optionalInstrumento.isPresent()) {
            Instrumento instrumento = optionalInstrumento.get();
            instrumento.setNombre(request.getNombre());
            instrumento.setDescripcion(request.getDescripcion());
            instrumento.setImagen(request.getImagen());
            instrumento.setMarca(request.getMarca());
            instrumento.setModelo(request.getModelo());
            instrumento.setCantidadVendida(request.getCantidadVendida());
            instrumento.setCostoEnvio(request.getCostoEnvio());
            instrumento.setPrecio(request.getPrecio());
            instrumento.setCategoriaInstrumento(request.getCategoriaInstrumento());
            return instrumentoDAO.save(instrumento); // no olvides guardar el cambio
        } else {
            throw new RuntimeException("Instrumento no encontrado con id: " + id);
        }
    }    public Boolean deleteInstrumento (int id){
        try {
            instrumentoDAO.deleteById(id);
            return true;
        }catch (Exception e){
            return  false;
        }
    }

}
