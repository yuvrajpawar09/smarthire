package com.smarthire.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.HashMap;
import java.util.Map;

@Service
public class MatchService {

    @Value("${ml.service.url}")
    private String mlServiceUrl;

    // Calls Flask ML service and returns score 0-100
    public double getMatchScore(String resumeText, String jobDescription) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            Map<String, String> request = new HashMap<>();
            request.put("resume_text", resumeText);
            request.put("job_description", jobDescription);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, String>> entity =
                    new HttpEntity<>(request, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                    mlServiceUrl + "/match", entity, Map.class);

            if (response.getStatusCode() == HttpStatus.OK
                    && response.getBody() != null) {
                Object score = response.getBody().get("score");
                return Double.parseDouble(score.toString());
            }

        } catch (Exception e) {
            // Flask is down — return 0 instead of crashing
            System.out.println("ML service unavailable: " + e.getMessage());
        }
        return 0.0;
    }
}