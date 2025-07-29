import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { LoginRequest } from '../model/login-request';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: LoginRequest = new LoginRequest;
  message = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    this.authService.login(this.loginForm)
      .subscribe({
        next: (res) => {
          this.message = 'Login successful!';
          // Save token if needed: localStorage.setItem('token', res.token);
          this.router.navigate(['/']); // go to home/landing page
        },
        error: (err) => {
          this.message = err.error || 'Login failed.';
        },
      });
  }

  showPassword = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

}
