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
  signupForm!: SignupRequest;
  message = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.signup(this.signupForm)
      .subscribe({
        next: (res) => {
          this.message = 'Signup successful!';
          this.router.navigate(['/auth/login']);
        },
        error: (err) => {
          this.message = err.error || 'Signup failed.';
        },
      });
  }
}
