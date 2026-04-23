package com.smarthire.service;

import com.smarthire.entity.Application;
import com.smarthire.entity.Job;
import com.smarthire.entity.User;
import com.smarthire.repository.ApplicationRepository;
import com.smarthire.repository.JobRepository;
import com.smarthire.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class StatsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    // ── RECRUITER STATS ─────────────────────────────────
    public Map<String, Object> getRecruiterStats(String recruiterEmail) {

        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Job> myJobs = jobRepository.findByRecruiter(recruiter);

        // Total jobs posted
        long totalJobs = myJobs.size();

        // Active vs closed jobs
        long activeJobs = myJobs.stream()
                .filter(j -> j.getStatus() == Job.JobStatus.ACTIVE)
                .count();

        // Total applicants across all jobs
        long totalApplicants = myJobs.stream()
                .mapToLong(job -> applicationRepository.countByJob(job))
                .sum();

        // Applications by status across all recruiter jobs
        Map<String, Long> applicationsByStatus = new LinkedHashMap<>();
        applicationsByStatus.put("APPLIED", 0L);
        applicationsByStatus.put("SHORTLISTED", 0L);
        applicationsByStatus.put("INTERVIEW", 0L);
        applicationsByStatus.put("HIRED", 0L);
        applicationsByStatus.put("REJECTED", 0L);

        for (Job job : myJobs) {
            List<Application> apps = applicationRepository.findByJob(job);
            for (Application app : apps) {
                String status = app.getStatus().name();
                applicationsByStatus.merge(status, 1L, Long::sum);
            }
        }

        // Jobs with most applicants (top 5)
        List<Map<String, Object>> topJobs = myJobs.stream()
                .map(job -> {
                    Map<String, Object> jobStat = new LinkedHashMap<>();
                    jobStat.put("jobTitle", job.getTitle());
                    jobStat.put("applicantCount",
                            applicationRepository.countByJob(job));
                    return jobStat;
                })
                .sorted((a, b) -> Long.compare(
                        (Long) b.get("applicantCount"),
                        (Long) a.get("applicantCount")))
                .limit(5)
                .collect(Collectors.toList());

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalJobsPosted", totalJobs);
        stats.put("activeJobs", activeJobs);
        stats.put("closedJobs", totalJobs - activeJobs);
        stats.put("totalApplicants", totalApplicants);
        stats.put("applicationsByStatus", applicationsByStatus);
        stats.put("topJobsByApplicants", topJobs);

        return stats;
    }

    // ── CANDIDATE STATS ──────────────────────────────────
    public Map<String, Object> getCandidateStats(String candidateEmail) {

        User candidate = userRepository.findByEmail(candidateEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Application> myApplications =
                applicationRepository.findByCandidate(candidate);

        // Total applications
        long totalApplications = myApplications.size();

        // Count by status
        long shortlisted = myApplications.stream()
                .filter(a -> a.getStatus() ==
                        Application.ApplicationStatus.SHORTLISTED)
                .count();

        long interviews = myApplications.stream()
                .filter(a -> a.getStatus() ==
                        Application.ApplicationStatus.INTERVIEW)
                .count();

        long hired = myApplications.stream()
                .filter(a -> a.getStatus() ==
                        Application.ApplicationStatus.HIRED)
                .count();

        long rejected = myApplications.stream()
                .filter(a -> a.getStatus() ==
                        Application.ApplicationStatus.REJECTED)
                .count();

        // Recent applications (last 5)
        List<Map<String, Object>> recentApplications = myApplications.stream()
                .sorted((a, b) -> b.getAppliedAt().compareTo(a.getAppliedAt()))
                .limit(5)
                .map(app -> {
                    Map<String, Object> appStat = new LinkedHashMap<>();
                    appStat.put("jobTitle", app.getJob().getTitle());
                    appStat.put("company", app.getJob().getCompany());
                    appStat.put("status", app.getStatus().name());
                    appStat.put("appliedAt", app.getAppliedAt().toString());
                    return appStat;
                })
                .collect(Collectors.toList());

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalApplications", totalApplications);
        stats.put("shortlisted", shortlisted);
        stats.put("interviews", interviews);
        stats.put("hired", hired);
        stats.put("rejected", rejected);
        stats.put("recentApplications", recentApplications);

        return stats;
    }
}