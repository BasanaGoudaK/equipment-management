package com.equipment.service;

import com.equipment.dto.EquipmentDTO;
import com.equipment.exception.BusinessRuleException;
import com.equipment.exception.ResourceNotFoundException;
import com.equipment.model.Equipment;
import com.equipment.model.EquipmentType;
import com.equipment.model.Status;
import com.equipment.repository.EquipmentRepository;
import com.equipment.repository.EquipmentTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EquipmentService {

    private final EquipmentRepository equipmentRepository;
    private final EquipmentTypeRepository equipmentTypeRepository;

    public List<Equipment> getAllEquipment(String statusFilter) {
        if (statusFilter != null && !statusFilter.isBlank()) {
            Status status = Status.valueOf(statusFilter.toUpperCase());
            return equipmentRepository.findAllByStatusOptional(status);
        }
        return equipmentRepository.findAllByStatusOptional(null);
    }

    @Transactional
    public Equipment createEquipment(EquipmentDTO dto) {
        EquipmentType type = equipmentTypeRepository.findById(dto.getTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Equipment type not found with id: " + dto.getTypeId()));

        validateActiveStatusRule(dto.getStatus(), dto.getLastCleanedDate());

        Equipment equipment = new Equipment();
        equipment.setName(dto.getName());
        equipment.setType(type);
        equipment.setStatus(dto.getStatus());
        equipment.setLastCleanedDate(dto.getLastCleanedDate());

        return equipmentRepository.save(equipment);
    }

    @Transactional
    public Equipment updateEquipment(Long id, EquipmentDTO dto) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipment not found with id: " + id));

        EquipmentType type = equipmentTypeRepository.findById(dto.getTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Equipment type not found with id: " + dto.getTypeId()));

        validateActiveStatusRule(dto.getStatus(), dto.getLastCleanedDate());

        equipment.setName(dto.getName());
        equipment.setType(type);
        equipment.setStatus(dto.getStatus());
        equipment.setLastCleanedDate(dto.getLastCleanedDate());

        return equipmentRepository.save(equipment);
    }

    @Transactional
    public void deleteEquipment(Long id) {
        if (!equipmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Equipment not found with id: " + id);
        }
        equipmentRepository.deleteById(id);
    }

    public List<EquipmentType> getAllTypes() {
        return equipmentTypeRepository.findAll();
    }

    /**
     * Business Rule: Equipment cannot be marked as ACTIVE if last cleaned date is older than 30 days.
     * This is NOT applied when maintenance is added (that path bypasses this check).
     */
    private void validateActiveStatusRule(Status status, LocalDate lastCleanedDate) {
        if (status == Status.ACTIVE) {
            if (lastCleanedDate == null) {
                throw new BusinessRuleException(
                        "Equipment cannot be marked as Active: Last Cleaned Date is required when setting status to Active.");
            }
            LocalDate thirtyDaysAgo = LocalDate.now().minusDays(30);
            if (lastCleanedDate.isBefore(thirtyDaysAgo)) {
                throw new BusinessRuleException(
                        "Equipment cannot be marked as Active because the Last Cleaned Date (" + lastCleanedDate +
                        ") is older than 30 days. Please log a maintenance event to update the equipment status.");
            }
        }
    }
}
