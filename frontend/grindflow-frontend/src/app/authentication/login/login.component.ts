import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { LoginRequest } from '../model/login-request';

declare const google: any;

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true,
})

export class LoginComponent {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    google.accounts.id.initialize({
      client_id: '980612145502-mh1uleaqgsjjin2ok8qd1tuiaofvei05.apps.googleusercontent.com',
      callback: this.handleCredentialResponse.bind(this)
    });

    google.accounts.id.renderButton(
      document.getElementById('google-button'),
      { theme: 'outline', size: 'large' }
    );
  }


  loginForm: LoginRequest = new LoginRequest();
  message = '';
  loading = false;
  showPassword = false;

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

  handleCredentialResponse(response: any) {
    const idToken = response.credential;
  
    this.authService.googleLogin(idToken).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Google login failed', err);
        this.message = 'Google login failed';
      }
    });
  }  

}

