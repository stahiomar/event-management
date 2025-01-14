package com.example.mail_service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

@RestController
@CrossOrigin
public class MailController {

    @Autowired
    private final MailService mailService;

    public MailController(MailService mailService) {
        this.mailService = mailService;
    }

    @PostMapping("/mail/send")
    public ResponseEntity<String> sendMail(@RequestBody Mail mail) {
        // Build the email message
        String message = String.format(
                "السلام عليكم ورحمة الله وبركاته,\n\n" +
                        "We hope this message finds you well. This is a reminder about your upcoming event:\n\n" +
                        "Event: \"%s\"\n" +
                        "Date: %s\n" +
                        "Time: %s\n" +
                        "Location: \"%s\"\n\n" +
                        "Please feel free to reach out if you have any questions or need further assistance.\n\n" +
                        "Best regards,\n" +
                        "Your Team",
                mail.getTitle(),
                mail.getDate(),
                mail.getTime(),
                mail.getLocation()
        );

        mailService.sendMail(mail.getReceiver(), mail.getTitle(), message);
        return ResponseEntity.ok("Email sent successfully!");
    }
}
