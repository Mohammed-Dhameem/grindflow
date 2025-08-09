package com.example.grindflowbackend.Model.Enum;

public class EnumeratedClass {

    public enum AuthProvider {
        LOCAL,
        GOOGLE,
        FACEBOOK
    }

    public enum OtpStatus {
        VALID, EXPIRED, INVALID
    }
}
