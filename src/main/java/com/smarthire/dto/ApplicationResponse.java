package com.smarthire.dto;

import com.smarthire.entity.Application;
import com.smarthire.entity.Application.ApplicationStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ApplicationResponse {

    private Long id;
    private Long jobId;
    private String jobTitle;
    private String company;
    private String location;
    private Long candidateId;
    private String candidateName;
    private String candidateEmail;
    private ApplicationStatus status;
    private String coverLetter;
    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;

    public static ApplicationResponse fromApplication(Application app) {
        ApplicationResponse response = new ApplicationResponse();
        response.setId(app.getId());
        response.setJobId(app.getJob().getId());
        response.setJobTitle(app.getJob().getTitle());
        response.setCompany(app.getJob().getCompany());
        response.setLocation(app.getJob().getLocation());
        response.setCandidateId(app.getCandidate().getId());
        response.setCandidateName(app.getCandidate().getFullName());
        response.setCandidateEmail(app.getCandidate().getEmail());
        response.setStatus(app.getStatus());
        response.setCoverLetter(app.getCoverLetter());
        response.setAppliedAt(app.getAppliedAt());
        response.setUpdatedAt(app.getUpdatedAt());
        return response;
    }
}