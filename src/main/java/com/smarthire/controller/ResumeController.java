package com.smarthire.controller;

import com.smarthire.service.ResumeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/resume")
@CrossOrigin(origins = "http://localhost:3000")
public class ResumeController {

    @Autowired
    private ResumeService resumeService;

    // POST /api/resume/upload — Candidate uploads PDF resume
    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadResume(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        try {
            String candidateEmail = authentication.getName();
            Map<String, String> response =
                    resumeService.uploadResume(file, candidateEmail);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "File upload failed: " + e.getMessage()));
        }
    }

    // GET /api/resume/match/{jobId} — Get match score for a job
    @GetMapping("/match/{jobId}")
    public ResponseEntity<Map<String, Object>> getMatchScore(
            @PathVariable Long jobId,
            Authentication authentication) {
        String candidateEmail = authentication.getName();
        Map<String, Object> response =
                resumeService.getMatchScore(jobId, candidateEmail);
        return ResponseEntity.ok(response);
    }

    // GET /api/resume/my — Get candidate's uploaded resume info
    @GetMapping("/my")
    public ResponseEntity<Map<String, String>> getMyResume(
            Authentication authentication) {
        String candidateEmail = authentication.getName();
        Map<String, String> response =
                resumeService.getMyResume(candidateEmail);
        return ResponseEntity.ok(response);
    }
}