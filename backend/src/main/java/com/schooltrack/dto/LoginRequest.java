package com.schooltrack.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;

public class LoginRequest {
    @NotBlank(message = "Login identifier (Teacher ID, Roll Number, Email, or Phone) is required")
    @JsonAlias({"email", "username", "identifier", "teacherId", "rollNumber", "phone"})
    private String usernameOrEmail;

    @NotBlank(message = "Password is required")
    private String password;

    public LoginRequest() {}

    public LoginRequest(String usernameOrEmail, String password) {
        this.usernameOrEmail = usernameOrEmail;
        this.password = password;
    }

    public String getUsernameOrEmail() { return usernameOrEmail; }
    public void setUsernameOrEmail(String usernameOrEmail) { this.usernameOrEmail = usernameOrEmail; }

    public void setEmail(String email) {
        if (this.usernameOrEmail == null || this.usernameOrEmail.isEmpty()) {
            this.usernameOrEmail = email;
        }
    }

    public void setUsername(String username) {
        if (this.usernameOrEmail == null || this.usernameOrEmail.isEmpty()) {
            this.usernameOrEmail = username;
        }
    }

    public void setIdentifier(String identifier) {
        if (this.usernameOrEmail == null || this.usernameOrEmail.isEmpty()) {
            this.usernameOrEmail = identifier;
        }
    }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
