package com.example.grindflowbackend.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    String from = "grindflow.webapp@gmail.com";

    public void sendTestMail() {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo("nmaldhameem115@gmail.com");
//        message.setCc();
        message.setSubject("Test mail");
        message.setText("Test mail from grindflow");

        mailSender.send(message);
    }
}

