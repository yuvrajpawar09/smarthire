package com.smarthire.service;

import com.smarthire.entity.Job;
import com.smarthire.entity.Resume;
import com.smarthire.entity.User;
import com.smarthire.repository.JobRepository;
import com.smarthire.repository.ResumeRepository;
import com.smarthire.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

@Service
public class ResumeService {

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private MatchService matchService;

    @Value("${file.upload-dir}")
    private String uploadDir;

    // ── UPLOAD RESUME ───────────────────────────────────
    public Map<String, String> uploadResume(MultipartFile file,
                                            String candidateEmail) throws IOException {

        User candidate = userRepository.findByEmail(candidateEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (candidate.getRole() != com.smarthire.entity.User.Role.CANDIDATE) {
            throw new RuntimeException("Only candidates can upload resumes");
        }

        // Validate file type
        String originalFileName = file.getOriginalFilename();
        if (originalFileName == null ||
                !originalFileName.toLowerCase().endsWith(".pdf")) {
            throw new RuntimeException("Only PDF files are allowed");
        }

        // Create uploads directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Save file with candidate email as prefix to avoid conflicts
        String fileName = candidateEmail.replace("@", "_").replace(".", "_")
                + "_" + originalFileName;
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath,
                java.nio.file.StandardCopyOption.REPLACE_EXISTING);

        // Save or update resume record in DB
        Resume resume = resumeRepository.findByCandidate(candidate)
                .orElse(new Resume());
        resume.setFileName(originalFileName);
        resume.setFilePath(filePath.toString());
        resume.setCandidate(candidate);
        resumeRepository.save(resume);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Resume uploaded successfully");
        response.put("fileName", originalFileName);
        return response;
    }

    // ── GET MATCH SCORE ─────────────────────────────────
    public Map<String, Object> getMatchScore(Long jobId, String candidateEmail) {

        User candidate = userRepository.findByEmail(candidateEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Resume resume = resumeRepository.findByCandidate(candidate)
                .orElseThrow(() -> new RuntimeException(
                        "Please upload your resume first"));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        // Use extracted text or skills as resume text
        String resumeText = resume.getExtractedText() != null
                ? resume.getExtractedText()
                : resume.getFileName();

        String jobDescription = job.getDescription() + " " + job.getSkills();

        double score = matchService.getMatchScore(resumeText, jobDescription);

        String message;
        if (score >= 70) message = "Excellent match!";
        else if (score >= 50) message = "Good match!";
        else if (score >= 30) message = "Partial match";
        else message = "Low match — consider updating your resume";

        Map<String, Object> response = new HashMap<>();
        response.put("jobId", jobId);
        response.put("jobTitle", job.getTitle());
        response.put("matchScore", Math.round(score * 10.0) / 10.0);
        response.put("message", message);
        return response;
    }

    // ── GET MY RESUME ────────────────────────────────────
    public Map<String, String> getMyResume(String candidateEmail) {

        User candidate = userRepository.findByEmail(candidateEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Resume resume = resumeRepository.findByCandidate(candidate)
                .orElseThrow(() -> new RuntimeException("No resume uploaded yet"));

        Map<String, String> response = new HashMap<>();
        response.put("fileName", resume.getFileName());
        response.put("uploadedAt", resume.getUploadedAt().toString());
        return response;
    }
}