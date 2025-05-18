package com.example.lab4_tp4_react_sprint.DAO;

import com.example.lab4_tp4_react_sprint.models.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface PedidoDAO extends JpaRepository<Pedido, Integer>{
    // --- Nuevo método para obtener cantidad de pedidos por mes y año ---
    @Query("SELECT YEAR(p.fecha_pedido), MONTH(p.fecha_pedido), COUNT(p) " +
            "FROM Pedido p " +
            "GROUP BY YEAR(p.fecha_pedido), MONTH(p.fecha_pedido) " +
            "ORDER BY YEAR(p.fecha_pedido) ASC, MONTH(p.fecha_pedido) ASC")
    List<Object[]> countPedidosByMonthAndYear();
    // --- Nuevo método para obtener la cantidad total vendida por instrumento ---
    // Esta consulta asume:
    // - Pedido p tiene una colección de items (ej. p.items)
    // - Cada ItemPedido item tiene una relación a Instrumento (ej. item.instrumento)
    // - Instrumento i tiene un campo para el nombre (ej. i.instrumento) y la cantidad en ItemPedido es item.cantidad
    @Query("SELECT i.nombre, SUM(item.cantidad) " + // Selecciona el campo 'instrumento' de la entidad Instrumento y suma el campo 'cantidad' de ItemPedido
            "FROM Pedido p JOIN p.detallePedidos item JOIN item.instrumento i " + // Joins: Pedido -> ItemPedido -> Instrumento
            "GROUP BY i.id, i.nombre " + // Agrupa por el ID y el nombre del Instrumento
            "ORDER BY SUM(item.cantidad) DESC") // Ordena por la cantidad vendida (opcional)
    List<Object[]> sumCantidadVendidaByInstrumento();
    // Esta consulta obtiene los datos necesarios y filtra por rango de fechas de pedido
    // AJUSTA nombres de campos/relaciones (p.fechaPedido, i.marca, i.modelo, item.cantidad, i.precio, p.items, item.instrumento i)
    // para que coincidan con tus entidades Pedido, ItemPedido e Instrumento.
    @Query("SELECT p.fecha_pedido, i.marca, i.modelo, item.cantidad, i.precio, (item.cantidad * i.precio) " +
            "FROM Pedido p JOIN p.detallePedidos item JOIN item.instrumento i " + // Joins
            "WHERE p.fecha_pedido BETWEEN :fechaDesde AND :fechaHasta " + // Filtro por rango de fechas
            "ORDER BY p.fecha_pedido ASC") // Opcional: ordenar por fecha
    List<Object[]> findPedidoDetailsByFechaPedidoBetween(
            @Param("fechaDesde") Date fechaDesde, // Ajusta el tipo de Date si usas LocalDate/LocalDateTime
            @Param("fechaHasta") Date fechaHasta
    );
}

