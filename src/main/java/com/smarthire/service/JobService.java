package com.smarthire.service;

import com.smarthire.dto.JobRequest;
import com.smarthire.dto.JobResponse;
import com.smarthire.entity.Job;
import com.smarthire.entity.User;
import com.smarthire.repository.JobRepository;
import com.smarthire.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    // ── CREATE JOB (Recruiter only) ─────────────────────
    public JobResponse createJob(JobRequest request, String recruiterEmail) {

        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));

        if (recruiter.getRole() != User.Role.RECRUITER) {
            throw new RuntimeException("Only recruiters can post jobs");
        }

        Job job = new Job();
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setCompany(request.getCompany());
        job.setLocation(request.getLocation());
        job.setJobType(request.getJobType());
        job.setSkills(request.getSkills());
        job.setSalaryRange(request.getSalaryRange());
        job.setStatus(request.getStatus() != null ? request.getStatus() : Job.JobStatus.ACTIVE);
        job.setRecruiter(recruiter);

        Job saved = jobRepository.save(job);
        return JobResponse.fromJob(saved);
    }

    // ── GET ALL JOBS with search, filter, pagination ────
    public Page<JobResponse> getAllJobs(String keyword, String location,
                                        String jobType, int page, int size) {

        Pageable pageable = PageRequest.of(page, size,
                Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<Job> jobs;

        if (keyword != null && !keyword.isEmpty()) {
            jobs = jobRepository.searchByKeyword(keyword, pageable);
        } else if (location != null && !location.isEmpty()) {
            jobs = jobRepository.findByLocationContainingIgnoreCaseAndStatus(
                    location, Job.JobStatus.ACTIVE, pageable);
        } else if (jobType != null && !jobType.isEmpty()) {
            jobs = jobRepository.findByJobTypeAndStatus(
                    Job.JobType.valueOf(jobType.toUpperCase()), Job.JobStatus.ACTIVE, pageable);
        } else {
            jobs = jobRepository.findByStatus(Job.JobStatus.ACTIVE, pageable);
        }

        return jobs.map(JobResponse::fromJob);
    }

    // ── GET SINGLE JOB ──────────────────────────────────
    public JobResponse getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));
        return JobResponse.fromJob(job);
    }

    // ── UPDATE JOB (only the recruiter who posted it) ───
    public JobResponse updateJob(Long id, JobRequest request, String recruiterEmail) {

        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));

        // Check if this recruiter owns this job
        if (!job.getRecruiter().getEmail().equals(recruiterEmail)) {
            throw new RuntimeException("You can only edit your own jobs");
        }

        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setCompany(request.getCompany());
        job.setLocation(request.getLocation());
        job.setJobType(request.getJobType());
        job.setSkills(request.getSkills());
        job.setSalaryRange(request.getSalaryRange());
        if (request.getStatus() != null) {
            job.setStatus(request.getStatus());
        }

        Job updated = jobRepository.save(job);
        return JobResponse.fromJob(updated);
    }

    // ── DELETE JOB (only the recruiter who posted it) ───
    public String deleteJob(Long id, String recruiterEmail) {

        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));

        if (!job.getRecruiter().getEmail().equals(recruiterEmail)) {
            throw new RuntimeException("You can only delete your own jobs");
        }

        jobRepository.delete(job);
        return "Job deleted successfully";
    }

    // ── GET MY JOBS (Recruiter's own jobs) ──────────────
    public List<JobResponse> getMyJobs(String recruiterEmail) {

        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));

        return jobRepository.findByRecruiter(recruiter)
                .stream()
                .map(JobResponse::fromJob)
                .collect(Collectors.toList());
    }
}