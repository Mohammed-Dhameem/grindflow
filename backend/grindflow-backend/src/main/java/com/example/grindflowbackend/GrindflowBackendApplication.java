package com.example.grindflowbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class GrindflowBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(GrindflowBackendApplication.class, args);
    }

}
