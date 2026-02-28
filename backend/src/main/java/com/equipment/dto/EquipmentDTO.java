package com.equipment.dto;

import com.equipment.model.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class EquipmentDTO {

    @NotBlank(message = "Equipment name is required")
    private String name;

    @NotNull(message = "Equipment type is required")
    private Long typeId;

    @NotNull(message = "Status is required")
    private Status status;

    private LocalDate lastCleanedDate;
}
