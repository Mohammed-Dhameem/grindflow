package com.example.grindflowbackend.Model.ModelDto;

import lombok.Data;

@Data
public class SignupRequest {
    private String name;
    private String email;
    private String password;
}
