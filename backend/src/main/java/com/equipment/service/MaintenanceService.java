package com.equipment.service;

import com.equipment.dto.MaintenanceDTO;
import com.equipment.exception.ResourceNotFoundException;
import com.equipment.model.Equipment;
import com.equipment.model.MaintenanceLog;
import com.equipment.model.Status;
import com.equipment.repository.EquipmentRepository;
import com.equipment.repository.MaintenanceLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MaintenanceService {

    private final MaintenanceLogRepository maintenanceLogRepository;
    private final EquipmentRepository equipmentRepository;

    /**
     * Business Rules when adding maintenance:
     * 1. Equipment status must automatically change to ACTIVE
     * 2. Last Cleaned Date must update to the Maintenance Date
     */
    @Transactional
    public MaintenanceLog addMaintenance(MaintenanceDTO dto) {
        Equipment equipment = equipmentRepository.findById(dto.getEquipmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Equipment not found with id: " + dto.getEquipmentId()));

        // Apply business rules - bypass the 30-day check since maintenance resets the date
        equipment.setStatus(Status.ACTIVE);
        equipment.setLastCleanedDate(dto.getMaintenanceDate());
        equipmentRepository.save(equipment);

        MaintenanceLog log = new MaintenanceLog();
        log.setEquipment(equipment);
        log.setMaintenanceDate(dto.getMaintenanceDate());
        log.setNotes(dto.getNotes());
        log.setPerformedBy(dto.getPerformedBy());

        return maintenanceLogRepository.save(log);
    }

    public List<MaintenanceLog> getMaintenanceByEquipment(Long equipmentId) {
        if (!equipmentRepository.existsById(equipmentId)) {
            throw new ResourceNotFoundException("Equipment not found with id: " + equipmentId);
        }
        return maintenanceLogRepository.findByEquipmentIdOrderByDateDesc(equipmentId);
    }
}
