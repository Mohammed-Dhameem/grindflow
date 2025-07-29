import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { LoginRequest } from '../model/login-request';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  loginForm: LoginRequest = new LoginRequest();
  message = '';
  showPassword = false;
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.loading = true;
    this.authService.login(this.loginForm).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.body && response.body.message) {
          this.message = response.body.message;
          this.router.navigate(['/home']); // Redirect to home/dashboard
        }
      },
      error: (err) => {
        this.loading = false;
        this.message = err.error?.error || err.error?.message || 'Login failed.';
      }
    });
  }
}