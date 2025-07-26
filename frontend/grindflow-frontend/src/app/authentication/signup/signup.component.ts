// src/app/authentication/signup/signup.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
})
export class SignupComponent {
  name = '';
  email = '';
  password = '';
  message = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.signup({ name: this.name, email: this.email, password: this.password })
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
