package com.example.lab4_tp4_react_sprint.DAO;

import com.example.lab4_tp4_react_sprint.models.Instrumento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InstrumentoDAO extends JpaRepository<Instrumento, Integer> {

}
