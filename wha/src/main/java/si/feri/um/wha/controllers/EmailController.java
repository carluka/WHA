package si.feri.um.wha.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import si.feri.um.wha.models.EmailService;

import jakarta.mail.MessagingException; // Use jakarta.mail.MessagingException
import java.io.IOException;

@RestController
@CrossOrigin
@RequestMapping("/email")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/send")
    public String sendEmail(
            @RequestParam String to,
            @RequestParam String subject,
            @RequestParam String body,
            @RequestPart(required = false) MultipartFile attachment
    ) {
        try {
            emailService.sendEmailWithAttachment(to, subject, body, attachment); // Removed the cast
            return "Email sent successfully";
        } catch (MessagingException | IOException e) { // Combined into a single catch block
            return "Error while sending email: " + e.getMessage();
        }
    }
}
