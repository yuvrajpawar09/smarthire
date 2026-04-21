package com.smarthire.repository;

import com.smarthire.entity.Application;
import com.smarthire.entity.Job;
import com.smarthire.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    // Get all applications by a candidate
    List<Application> findByCandidate(User candidate);

    // Get all applications for a job (recruiter view)
    List<Application> findByJob(Job job);

    // Check if candidate already applied to this job
    boolean existsByCandidateAndJob(User candidate, Job job);

    // Get specific application by candidate and job
    Optional<Application> findByCandidateAndJob(User candidate, Job job);

    // Count applications per job
    long countByJob(Job job);
}