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
        this.loading = false;
        this.message = response.body?.message || '';
        this.router.navigate(['/home']); // ✅ Cookie already set
      },
      error: (err) => {
        this.loading = false;
        this.message = err.error?.error || err.error?.message || 'Login failed.';
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  logout(){
    this.authService.logout().subscribe(() => this.router.navigate(['/login']));
  }

}

