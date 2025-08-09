package com.example.grindflowbackend.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class SchedulerService {

    @Autowired
    private EmailService emailService;

    //    @Scheduled(cron = "0 50 20 * * ?") // Every day at 8:45 PM
//    @Scheduled(cron = "0 * * * * ?")
    public void sendTestMail() {
        emailService.sendTestMail();
    }
}