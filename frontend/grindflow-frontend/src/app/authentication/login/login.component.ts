import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { LoginRequest } from '../model/login-request';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true,
})

export class LoginComponent {
  loginForm: LoginRequest = new LoginRequest();
  message = '';
  loading = false;
  showPassword = false;

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    this.loading = true;
    this.authService.login(this.loginForm).subscribe({
      next: (response) => {
        console.log('✅ Login successful', response);
        this.loading = false;
        this.message = response.body?.message || '';
        this.router.navigate(['/home']); // ✅ Should redirect
      },
      error: (err) => {
        console.warn('❌ Login failed', err);
        this.loading = false;
        this.message = err.error?.error || 'Login failed.';
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  logout() {
    this.authService.logout().subscribe(() => this.router.navigate(['/login']));
  }

}

