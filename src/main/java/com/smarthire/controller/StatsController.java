package com.smarthire.controller;

import com.smarthire.service.StatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/stats")
@CrossOrigin(origins = "http://localhost:3000")
public class StatsController {

    @Autowired
    private StatsService statsService;

    // GET /api/stats/recruiter — Recruiter dashboard stats
    @GetMapping("/recruiter")
    public ResponseEntity<Map<String, Object>> getRecruiterStats(
            Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(statsService.getRecruiterStats(email));
    }

    // GET /api/stats/candidate — Candidate dashboard stats
    @GetMapping("/candidate")
    public ResponseEntity<Map<String, Object>> getCandidateStats(
            Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(statsService.getCandidateStats(email));
    }
}