package com.equipment.repository;

import com.equipment.model.Equipment;
import com.equipment.model.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, Long> {

    @Query("SELECT e FROM Equipment e WHERE (:status IS NULL OR e.status = :status) ORDER BY e.id DESC")
    List<Equipment> findAllByStatusOptional(@Param("status") Status status);
}
