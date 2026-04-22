package com.smarthire.repository;

import com.smarthire.entity.Resume;
import com.smarthire.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {
    Optional<Resume> findByCandidate(User candidate);
    boolean existsByCandidate(User candidate);
}