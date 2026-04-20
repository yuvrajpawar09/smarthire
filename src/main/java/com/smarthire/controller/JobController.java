package com.smarthire.controller;

import com.smarthire.dto.JobRequest;
import com.smarthire.dto.JobResponse;
import com.smarthire.service.JobService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "http://localhost:3000")
public class JobController {

    @Autowired
    private JobService jobService;

    // POST /api/jobs — Recruiter posts a job
    @PostMapping
    public ResponseEntity<JobResponse> createJob(
            @Valid @RequestBody JobRequest request,
            Authentication authentication) {

        String recruiterEmail = authentication.getName();
        JobResponse response = jobService.createJob(request, recruiterEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // GET /api/jobs — Get all jobs with optional search/filter
    @GetMapping
    public ResponseEntity<Page<JobResponse>> getAllJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String jobType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<JobResponse> jobs = jobService.getAllJobs(
                keyword, location, jobType, page, size);
        return ResponseEntity.ok(jobs);
    }

    // GET /api/jobs/{id} — Get single job
    @GetMapping("/{id}")
    public ResponseEntity<JobResponse> getJobById(@PathVariable Long id) {
        JobResponse job = jobService.getJobById(id);
        return ResponseEntity.ok(job);
    }

    // PUT /api/jobs/{id} — Recruiter updates their job
    @PutMapping("/{id}")
    public ResponseEntity<JobResponse> updateJob(
            @PathVariable Long id,
            @Valid @RequestBody JobRequest request,
            Authentication authentication) {

        String recruiterEmail = authentication.getName();
        JobResponse response = jobService.updateJob(id, request, recruiterEmail);
        return ResponseEntity.ok(response);
    }

    // DELETE /api/jobs/{id} — Recruiter deletes their job
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteJob(
            @PathVariable Long id,
            Authentication authentication) {

        String recruiterEmail = authentication.getName();
        String message = jobService.deleteJob(id, recruiterEmail);
        return ResponseEntity.ok(message);
    }

    // GET /api/jobs/my-jobs — Recruiter sees their own jobs
    @GetMapping("/my-jobs")
    public ResponseEntity<List<JobResponse>> getMyJobs(
            Authentication authentication) {

        String recruiterEmail = authentication.getName();
        List<JobResponse> jobs = jobService.getMyJobs(recruiterEmail);
        return ResponseEntity.ok(jobs);
    }
}