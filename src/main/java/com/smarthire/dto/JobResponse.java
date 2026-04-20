package com.smarthire.dto;

import com.smarthire.entity.Job;
import com.smarthire.entity.Job.JobStatus;
import com.smarthire.entity.Job.JobType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class JobResponse {

    private Long id;
    private String title;
    private String description;
    private String company;
    private String location;
    private JobType jobType;
    private String skills;
    private String salaryRange;
    private JobStatus status;
    private String recruiterName;
    private String recruiterEmail;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Convert Job entity to JobResponse DTO
    public static JobResponse fromJob(Job job) {
        JobResponse response = new JobResponse();
        response.setId(job.getId());
        response.setTitle(job.getTitle());
        response.setDescription(job.getDescription());
        response.setCompany(job.getCompany());
        response.setLocation(job.getLocation());
        response.setJobType(job.getJobType());
        response.setSkills(job.getSkills());
        response.setSalaryRange(job.getSalaryRange());
        response.setStatus(job.getStatus());
        response.setRecruiterName(job.getRecruiter().getFullName());
        response.setRecruiterEmail(job.getRecruiter().getEmail());
        response.setCreatedAt(job.getCreatedAt());
        response.setUpdatedAt(job.getUpdatedAt());
        return response;
    }
}