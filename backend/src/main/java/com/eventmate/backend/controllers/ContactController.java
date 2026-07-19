//package com.eventmate.backend.controllers;
//
//
//
//import com.eventmate.backend.models.ContactMessage;
//import com.eventmate.backend.service.ContactService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/contact")
//@CrossOrigin(origins = "*") // allow frontend to call API
//public class ContactController {
//
//    @Autowired
//    private ContactService contactService;
//
//    @PostMapping
//    public ContactMessage saveContactMessage(@RequestBody ContactMessage message) {
//        return contactService.saveMessage(message);
//    }
//}


package com.eventmate.backend.controllers;

import com.eventmate.backend.models.ContactMessage;
import com.eventmate.backend.service.ContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = {"http://localhost:5173", "https://eventmate-pi.vercel.app"})
public class ContactController {

    @Autowired
    private ContactService contactService;

    @PostMapping("/send")
    public ResponseEntity<?> saveContactMessage(@RequestBody ContactMessage message) {
        try {
            if (message.getName() == null || message.getName().trim().isEmpty())
                return ResponseEntity.badRequest().body("Name is required");
            if (message.getEmail() == null || message.getEmail().trim().isEmpty())
                return ResponseEntity.badRequest().body("Email is required");
            if (message.getMessage() == null || message.getMessage().trim().isEmpty())
                return ResponseEntity.badRequest().body("Message cannot be empty");

            contactService.saveMessage(message);
            return ResponseEntity.ok("Message sent successfully!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error saving message: " + e.getMessage());
        }
    }
}
