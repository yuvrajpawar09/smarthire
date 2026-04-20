package com.smarthire.repository;

import com.smarthire.entity.Job;
import com.smarthire.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    // Search jobs by keyword in title or description
    @Query("SELECT j FROM Job j WHERE j.status = 'ACTIVE' AND " +
            "(LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(j.skills) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Job> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    // Filter by location
    Page<Job> findByLocationContainingIgnoreCaseAndStatus(
            String location, Job.JobStatus status, Pageable pageable);

    // Filter by job type
    Page<Job> findByJobTypeAndStatus(
            Job.JobType jobType, Job.JobStatus status, Pageable pageable);

    // Get all active jobs
    Page<Job> findByStatus(Job.JobStatus status, Pageable pageable);

    // Get jobs posted by a specific recruiter
    List<Job> findByRecruiter(User recruiter);

    // Get all active jobs by recruiter
    List<Job> findByRecruiterAndStatus(User recruiter, Job.JobStatus status);
}