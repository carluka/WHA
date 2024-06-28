package si.feri.um.wha.models;

import jakarta.mail.MessagingException; // Use jakarta.mail.MessagingException
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmailWithAttachment(String to, String subject, String body, MultipartFile attachment) throws MessagingException, IOException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(body);

        if (attachment != null && !attachment.isEmpty()) {
            // Get the original filename and content from the MultipartFile
            String originalFilename = attachment.getOriginalFilename();
            byte[] attachmentBytes = attachment.getBytes();

            // Add the attachment to the email
            helper.addAttachment(originalFilename, new ByteArrayResource(attachmentBytes));
        }

        mailSender.send(message);
    }
}
