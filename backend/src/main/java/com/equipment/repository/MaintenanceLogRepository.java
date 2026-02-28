package com.equipment.repository;

import com.equipment.model.MaintenanceLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaintenanceLogRepository extends JpaRepository<MaintenanceLog, Long> {

    @Query("SELECT m FROM MaintenanceLog m WHERE m.equipment.id = :equipmentId ORDER BY m.maintenanceDate DESC")
    List<MaintenanceLog> findByEquipmentIdOrderByDateDesc(@Param("equipmentId") Long equipmentId);
}
