package com.smarthire.service;

import com.smarthire.dto.ApplicationRequest;
import com.smarthire.dto.ApplicationResponse;
import com.smarthire.dto.StatusUpdateRequest;
import com.smarthire.entity.Application;
import com.smarthire.entity.Job;
import com.smarthire.entity.User;
import com.smarthire.repository.ApplicationRepository;
import com.smarthire.repository.JobRepository;
import com.smarthire.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    // ── APPLY TO JOB (Candidate only) ──────────────────
    public ApplicationResponse applyToJob(ApplicationRequest request,
                                          String candidateEmail) {

        User candidate = userRepository.findByEmail(candidateEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (candidate.getRole() != User.Role.CANDIDATE) {
            throw new RuntimeException("Only candidates can apply to jobs");
        }

        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (job.getStatus() != Job.JobStatus.ACTIVE) {
            throw new RuntimeException("This job is no longer accepting applications");
        }

        // Check duplicate application
        if (applicationRepository.existsByCandidateAndJob(candidate, job)) {
            throw new RuntimeException("You have already applied to this job");
        }

        Application application = new Application();
        application.setCandidate(candidate);
        application.setJob(job);
        application.setCoverLetter(request.getCoverLetter());
        application.setStatus(Application.ApplicationStatus.APPLIED);

        Application saved = applicationRepository.save(application);
        return ApplicationResponse.fromApplication(saved);
    }

    // ── GET MY APPLICATIONS (Candidate) ────────────────
    public List<ApplicationResponse> getMyApplications(String candidateEmail) {

        User candidate = userRepository.findByEmail(candidateEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return applicationRepository.findByCandidate(candidate)
                .stream()
                .map(ApplicationResponse::fromApplication)
                .collect(Collectors.toList());
    }

    // ── GET APPLICANTS FOR A JOB (Recruiter) ───────────
    public List<ApplicationResponse> getJobApplicants(Long jobId,
                                                      String recruiterEmail) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        // Only the recruiter who posted the job can see applicants
        if (!job.getRecruiter().getEmail().equals(recruiterEmail)) {
            throw new RuntimeException("You can only view applicants for your own jobs");
        }

        return applicationRepository.findByJob(job)
                .stream()
                .map(ApplicationResponse::fromApplication)
                .collect(Collectors.toList());
    }

    // ── UPDATE APPLICATION STATUS (Recruiter) ──────────
    public ApplicationResponse updateStatus(Long applicationId,
                                            StatusUpdateRequest request,
                                            String recruiterEmail) {

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        // Only the recruiter who owns the job can update status
        if (!application.getJob().getRecruiter().getEmail().equals(recruiterEmail)) {
            throw new RuntimeException("You can only update status for your own job applications");
        }

        application.setStatus(request.getStatus());
        Application updated = applicationRepository.save(application);
        return ApplicationResponse.fromApplication(updated);
    }

    // ── WITHDRAW APPLICATION (Candidate) ───────────────
    public String withdrawApplication(Long applicationId, String candidateEmail) {

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!application.getCandidate().getEmail().equals(candidateEmail)) {
            throw new RuntimeException("You can only withdraw your own applications");
        }

        if (application.getStatus() != Application.ApplicationStatus.APPLIED) {
            throw new RuntimeException("Cannot withdraw — application is already being processed");
        }

        applicationRepository.delete(application);
        return "Application withdrawn successfully";
    }

    // ── GET SINGLE APPLICATION ──────────────────────────
    public ApplicationResponse getApplicationById(Long id, String userEmail) {

        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        // Only candidate who applied or recruiter who owns the job can view
        boolean isCandidate = application.getCandidate().getEmail().equals(userEmail);
        boolean isRecruiter = application.getJob().getRecruiter().getEmail().equals(userEmail);

        if (!isCandidate && !isRecruiter) {
            throw new RuntimeException("You are not authorized to view this application");
        }

        return ApplicationResponse.fromApplication(application);
    }
}