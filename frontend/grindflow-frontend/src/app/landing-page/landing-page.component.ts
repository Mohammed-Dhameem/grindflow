import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../authentication/service/auth.service';
import { LoginRequest } from '../authentication/model/login-request';
import { SignupRequest } from '../authentication/model/signup-request';
import { environment } from '../authentication/environment/environment';

declare const google: any;

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  isLoginView = true;
  loginForm: LoginRequest = new LoginRequest();
  signupForm: SignupRequest = new SignupRequest();
  showPassword = false;
  message = '';
  loading = false;
  showEmailExistsModal = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.authService.checkLogin().subscribe({
        next: () => {
          this.router.navigate(['/home']);
        },
        error: () => {
          this.initGoogleLogin(); // only init if not already logged in
        }
      });
    }
  }

  toggleView(): void {
    this.isLoginView = !this.isLoginView;
    this.message = '';
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onLoginSubmit(): void {
    this.loading = true;
    this.authService.login(this.loginForm).subscribe({
      next: (response) => {
        this.loading = false;
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.loading = false;
        this.message = err.error?.error || 'Invalid email or password';
      }
    });
  }

  onSignupSubmit(): void {
    this.loading = true;
    this.authService.signup(this.signupForm).subscribe({
      next: () => {
        this.loading = false;
        this.message = 'User registered successfully. Please log in.';
        this.isLoginView = true;
      },
      error: (err) => {
        this.loading = false;
        const errMsg = err.error?.error || err.error?.message;
        if (err.status === 409 && errMsg.includes('Email is already registered')) {
          this.showEmailExistsModal = true;
        } else {
          this.message = errMsg || 'Signup failed.';
        }
      }
    });
  }

  private initGoogleLogin(): void {
    const checkGoogle = () => {
      if (typeof google !== 'undefined' && google.accounts) {
        google.accounts.id.initialize({
          client_id: environment.googleClientId,
          callback: this.handleCredentialResponse.bind(this),
        });

        google.accounts.id.renderButton(
          document.getElementById('google-button'),
          { theme: 'outline', size: 'large' }
        );
      } else {
        setTimeout(checkGoogle, 100);
      }
    };

    checkGoogle();
  }

  handleCredentialResponse(response: any): void {
    const idToken = response.credential;
    this.authService.googleLogin(idToken).subscribe({
      next: () => this.router.navigate(['/home']),
      error: (err) => {
        this.message = 'Google login failed';
        console.error(err);
      }
    });
  }

  closeModal(): void {
    this.showEmailExistsModal = false;
    this.isLoginView = true;
  }
}
