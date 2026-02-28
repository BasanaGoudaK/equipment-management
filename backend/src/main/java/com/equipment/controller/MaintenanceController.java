package com.equipment.controller;

import com.equipment.dto.MaintenanceDTO;
import com.equipment.model.MaintenanceLog;
import com.equipment.service.MaintenanceService;
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
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    @PostMapping("/maintenance")
    public ResponseEntity<MaintenanceLog> addMaintenance(@Valid @RequestBody MaintenanceDTO dto) {
        MaintenanceLog log = maintenanceService.addMaintenance(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(log);
    }

    @GetMapping("/equipment/{id}/maintenance")
    public ResponseEntity<List<MaintenanceLog>> getMaintenanceHistory(@PathVariable Long id) {
        return ResponseEntity.ok(maintenanceService.getMaintenanceByEquipment(id));
    }
}
