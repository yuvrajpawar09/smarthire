package com.smarthire.dto;

import com.smarthire.entity.Application.ApplicationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StatusUpdateRequest {

    @NotNull(message = "Status is required")
    private ApplicationStatus status;
}