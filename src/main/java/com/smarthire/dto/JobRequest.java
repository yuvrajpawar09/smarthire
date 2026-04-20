package com.smarthire.dto;

import com.smarthire.entity.Job.JobType;
import com.smarthire.entity.Job.JobStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class JobRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Company is required")
    private String company;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Job type is required")
    private JobType jobType;

    @NotBlank(message = "Skills are required")
    private String skills;

    private String salaryRange;

    private JobStatus status = JobStatus.ACTIVE;
}