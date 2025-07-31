import {
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  AfterViewInit,
} from '@angular/core';
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
export class LandingPageComponent implements OnInit, AfterViewInit {
  isLoginView = true;
  loginForm = new LoginRequest();
  signupForm = new SignupRequest();
  showPassword = false;
  message = '';
  loading = false;
  showEmailExistsModal = false;

  private isBrowser: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.authService.checkLogin().subscribe({
        next: () => this.router.navigate(['/home']),
        error: () => {} // do nothing if not logged in
      });
    }
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      // Slight delay ensures DOM is ready
      setTimeout(() => this.initGoogleLogin(), 50);
    }
  }

  toggleView(): void {
    this.isLoginView = !this.isLoginView;
    this.message = '';

    // Ensure Google button is re-rendered if view toggled
    if (this.isBrowser) {
      setTimeout(() => this.initGoogleLogin(), 50);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onLoginSubmit(): void {
    this.loading = true;
    this.authService.login(this.loginForm).subscribe({
      next: () => {
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
    const el = document.getElementById('google-button');

    if (!el || typeof google === 'undefined' || !google.accounts) {
      setTimeout(() => this.initGoogleLogin(), 100);
      return;
    }

    el.innerHTML = ''; // Clear existing button before rendering again

    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: this.handleCredentialResponse.bind(this),
    });

    google.accounts.id.renderButton(el, {
      theme: 'outline',
      size: 'large',
    });

    google.accounts.id.prompt(); // Optional
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
    this.signupForm = new SignupRequest();
    this.showEmailExistsModal = false;
    this.isLoginView = true;
  }
}
