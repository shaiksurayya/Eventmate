package com.eventmate.backend.controllers;

import com.eventmate.backend.models.Newsletter;
import com.eventmate.backend.repositories.NewsletterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/newsletter")
@CrossOrigin(origins = {"http://localhost:5173", "https://eventmate-pi.vercel.app"}) // allow your frontend
public class NewsletterController {

    @Autowired
    private NewsletterRepository newsletterRepository;

    @PostMapping("/subscribe")
    public ResponseEntity<String> subscribe(@RequestBody Newsletter newsletter) {
        // check if email already exists
        if (newsletterRepository.existsByEmail(newsletter.getEmail())) {
            return ResponseEntity.badRequest().body("Email already subscribed!");
        }

        newsletterRepository.save(newsletter);
        return ResponseEntity.ok("Subscribed successfully!");
    }
}
