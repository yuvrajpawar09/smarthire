package com.smarthire.controller;

import com.smarthire.dto.ApplicationRequest;
import com.smarthire.dto.ApplicationResponse;
import com.smarthire.dto.StatusUpdateRequest;
import com.smarthire.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:3000")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    // POST /api/applications/apply — Candidate applies to a job
    @PostMapping("/apply")
    public ResponseEntity<ApplicationResponse> applyToJob(
            @RequestBody ApplicationRequest request,
            Authentication authentication) {

        String candidateEmail = authentication.getName();
        ApplicationResponse response = applicationService.applyToJob(
                request, candidateEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // GET /api/applications/my — Candidate sees their applications
    @GetMapping("/my")
    public ResponseEntity<List<ApplicationResponse>> getMyApplications(
            Authentication authentication) {

        String candidateEmail = authentication.getName();
        List<ApplicationResponse> applications =
                applicationService.getMyApplications(candidateEmail);
        return ResponseEntity.ok(applications);
    }

    // GET /api/applications/job/{jobId} — Recruiter sees applicants for their job
    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<ApplicationResponse>> getJobApplicants(
            @PathVariable Long jobId,
            Authentication authentication) {

        String recruiterEmail = authentication.getName();
        List<ApplicationResponse> applications =
                applicationService.getJobApplicants(jobId, recruiterEmail);
        return ResponseEntity.ok(applications);
    }

    // PATCH /api/applications/{id}/status — Recruiter updates application status
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApplicationResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request,
            Authentication authentication) {

        String recruiterEmail = authentication.getName();
        ApplicationResponse response = applicationService.updateStatus(
                id, request, recruiterEmail);
        return ResponseEntity.ok(response);
    }

    // DELETE /api/applications/{id}/withdraw — Candidate withdraws application
    @DeleteMapping("/{id}/withdraw")
    public ResponseEntity<String> withdrawApplication(
            @PathVariable Long id,
            Authentication authentication) {

        String candidateEmail = authentication.getName();
        String message = applicationService.withdrawApplication(id, candidateEmail);
        return ResponseEntity.ok(message);
    }

    // GET /api/applications/{id} — View single application
    @GetMapping("/{id}")
    public ResponseEntity<ApplicationResponse> getApplicationById(
            @PathVariable Long id,
            Authentication authentication) {

        String userEmail = authentication.getName();
        ApplicationResponse response = applicationService.getApplicationById(
                id, userEmail);
        return ResponseEntity.ok(response);
    }
}