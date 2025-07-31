package com.example.grindflowbackend.Model;

import com.example.grindflowbackend.Model.Enum.EnumeratedClass;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String email;

    private String password;

    @Enumerated(EnumType.STRING)
    private EnumeratedClass.AuthProvider authProvider;
}
