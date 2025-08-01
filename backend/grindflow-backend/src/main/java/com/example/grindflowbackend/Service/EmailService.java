package com.example.grindflowbackend.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendMail() {
        SimpleMailMessage message = new SimpleMailMessage();
//        message.setTo();
//        message.setCc();
//        message.setSubject();
//        message.setText();
//        message.setFrom();

        mailSender.send(message);
    }
}

