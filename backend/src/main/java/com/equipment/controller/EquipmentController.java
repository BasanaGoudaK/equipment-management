package com.equipment.controller;

import com.equipment.dto.EquipmentDTO;
import com.equipment.model.Equipment;
import com.equipment.model.EquipmentType;
import com.equipment.service.EquipmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class EquipmentController {

    private final EquipmentService equipmentService;

    @GetMapping("/equipment")
    public ResponseEntity<List<Equipment>> getAllEquipment(
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(equipmentService.getAllEquipment(status));
    }

    @PostMapping("/equipment")
    public ResponseEntity<Equipment> createEquipment(@Valid @RequestBody EquipmentDTO dto) {
        Equipment created = equipmentService.createEquipment(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/equipment/{id}")
    public ResponseEntity<Equipment> updateEquipment(
            @PathVariable Long id,
            @Valid @RequestBody EquipmentDTO dto) {
        Equipment updated = equipmentService.updateEquipment(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/equipment/{id}")
    public ResponseEntity<Void> deleteEquipment(@PathVariable Long id) {
        equipmentService.deleteEquipment(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/equipment/types")
    public ResponseEntity<List<EquipmentType>> getEquipmentTypes() {
        return ResponseEntity.ok(equipmentService.getAllTypes());
    }
}
