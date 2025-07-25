package com.example.grindflowbackend.Model.ModelDto;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}
