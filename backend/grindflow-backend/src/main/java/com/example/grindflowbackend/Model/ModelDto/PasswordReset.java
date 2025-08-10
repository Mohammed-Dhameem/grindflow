package com.example.grindflowbackend.Model.ModelDto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PasswordReset {

    @NotBlank
    @Email
    private String email;
    private String password;
}
