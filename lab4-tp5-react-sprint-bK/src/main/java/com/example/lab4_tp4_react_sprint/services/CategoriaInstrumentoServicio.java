package com.example.lab4_tp4_react_sprint.services;

import com.example.lab4_tp4_react_sprint.DAO.CategoriaInstrumentoDAO;
import com.example.lab4_tp4_react_sprint.models.CategoriaInstrumento;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class CategoriaInstrumentoServicio {
    @Autowired
    CategoriaInstrumentoDAO categoriaInstrumentoDAO;
    public ArrayList<CategoriaInstrumento> getCategoriaInstrumento(){
        return (ArrayList<CategoriaInstrumento>) categoriaInstrumentoDAO.findAll();
    }

    public CategoriaInstrumento saveCategoriaInstrumento (CategoriaInstrumento intrumento){
        return categoriaInstrumentoDAO.save(intrumento);
    }

    public Optional<CategoriaInstrumento> getById(int id){
        return categoriaInstrumentoDAO.findById(id);
    }
    public CategoriaInstrumento updateById(CategoriaInstrumento request,int id ){
        CategoriaInstrumento    categoriaInstrumento = categoriaInstrumentoDAO.findById(id).get();
        categoriaInstrumento.setDenominacion(request.getDenominacion());
        categoriaInstrumento.setId(request.getId());

        return categoriaInstrumento;
    }

}
