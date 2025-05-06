package com.example.lab4_tp4_react_sprint.DAO;

import com.example.lab4_tp4_react_sprint.models.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PedidoDAO extends JpaRepository<Pedido, Integer>{

}

