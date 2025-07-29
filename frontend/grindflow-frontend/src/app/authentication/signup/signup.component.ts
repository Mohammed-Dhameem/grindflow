// src/app/authentication/signup/signup.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { SignupRequest } from '../model/signup-request';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
})
export class SignupComponent {
  signupForm: SignupRequest = new SignupRequest;
  message = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.signup(this.signupForm).subscribe({
      next: (response) => {
        if (response.body && response.body.message) {
          this.message = response.body.message;
          // Optionally redirect after success:
          this.router.navigate(['/auth/login']);
        }
      },
      error: (err) => {
        // Prefer error.error.error (from backend) or fallback
        this.message = err.error?.error || err.error?.message || 'Signup failed.';
      }
    });
  }
}
