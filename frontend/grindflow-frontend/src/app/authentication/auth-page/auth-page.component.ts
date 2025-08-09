import { Component, Inject, OnInit, PLATFORM_ID, AfterViewInit, ViewChild } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../service/auth.service';
import { LoginRequest } from '../model/login-request';
import { SignupRequest } from '../model/signup-request';
import { environment } from '../environment/environment';
import { fade } from '../../animations/animations';

declare const google: any;

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.css'],
  animations: [fade],
})
export class AuthPageComponent implements OnInit, AfterViewInit {
  isLoginView = true;
  loginForm = new LoginRequest();
  signupForm = new SignupRequest();
  showPassword = false;
  message = '';
  loading = false;
  showEmailExistsModal = false;

  passwordStrength = '';
  passwordStrengthLabel = '';
  isPasswordStrongEnough = false;
  passwordTyped: boolean = false;

  @ViewChild('signupFormRef') signupFormRef!: NgForm;


  private isBrowser: boolean;
  private googleInitRetryCount = 0;
  private readonly maxGoogleInitRetry = 20;
  private isGoogleInitialized = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.authService.checkLogin().subscribe({
        next: () => this.router.navigate(['/home']),
        error: () => { },
      });
    }
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      setTimeout(() => this.initGoogleLogin(), 50);
    }
  }

  toggleView(): void {
    this.isLoginView = !this.isLoginView;
    this.message = '';
    if (this.isBrowser && !this.isGoogleInitialized) {
      setTimeout(() => {
        this.initGoogleLogin();
        this.isGoogleInitialized = true;
      }, 50);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onLoginSubmit(form: NgForm): void {
    if (form.invalid) {
      this.message = 'Please fill in all the fields.';
      return;
    }

    this.loading = true;
    this.message = '';

    this.authService.login(this.loginForm).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/home']);
      },
      error: ({ status, error }) => {
        this.loading = false;
        if (status === 403) {
          this.message = error?.error || 'You have previously logged in using a different platform.';
        } else if (status === 401) {
          this.message = 'Invalid email or password.';
        } else {
          this.message = 'An unexpected error occurred. Please try again later.';
        }
      },
    });
  }

  onSignupSubmit(form: NgForm): void {
    if (!this.isPasswordStrongEnough) {
      this.message = 'Please choose a stronger password before signing up.';
      return;
    }

    if (form.invalid) {
      this.message = 'Please fill in all the fields.';
      return;
    }

    this.loading = true;
    this.message = '';

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
      },
    });
  }

  private initGoogleLogin(): void {
    const el = document.getElementById('googleBtn');
    if (!el || typeof google === 'undefined' || !google.accounts) {
      if (this.googleInitRetryCount >= this.maxGoogleInitRetry) {
        console.warn('Google SDK failed to load.');
        return;
      }
      this.googleInitRetryCount++;
      setTimeout(() => this.initGoogleLogin(), 100);
      return;
    }
    this.googleInitRetryCount = 0;

    el.innerHTML = ''; // clear existing render
    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: this.handleCredentialResponse.bind(this),
    });

    google.accounts.id.renderButton(el, {
      theme: 'filled_black',
      size: 'large',
      type: 'standard',
      shape: 'pill',
      logo_alignment: 'left',
    });

    google.accounts.id.prompt(); // Optional, shows one-tap
  }

  handleCredentialResponse(response: any): void {
    if (!response || !response.credential) {
      this.message = 'Google login failed: no credential received.';
      return;
    }
    const idToken = response.credential;
    this.authService.googleLogin(idToken).subscribe({
      next: () => this.router.navigate(['/home']),
      error: (err) => {
        this.message = 'Google login failed';
        console.error(err);
      },
    });
  }

  closeModal(form?: NgForm): void {
    if (form) {
      form.resetForm();
    } else {
      this.signupForm.name = '';
      this.signupForm.email = '';
      this.signupForm.password = '';
      this.signupForm.confirmPassword = '';
    }
    this.showEmailExistsModal = false;
    this.isLoginView = true;
    this.message = '';
  }

  checkPasswordStrength(password: string): void {
    this.passwordTyped = password.length > 0;
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[@$!%*?&]/.test(password);
    const lengthValid = password.length >= 8;

    const score = [hasUpper, hasNumber, hasSpecial, lengthValid].filter(Boolean).length;

    if (!lengthValid) {
      this.passwordStrength = 'weak';
      this.passwordStrengthLabel = 'Too short';
    } else if (score <= 1) {
      this.passwordStrength = 'weak';
      this.passwordStrengthLabel = 'Very Weak';
    } else if (score === 2) {
      this.passwordStrength = 'weak';
      this.passwordStrengthLabel = 'Weak';
    } else if (score === 3) {
      this.passwordStrength = 'medium';
      this.passwordStrengthLabel = 'Medium';
    } else if (score === 4) {
      this.passwordStrength = 'strong';
      this.passwordStrengthLabel = 'Strong';
    }

    this.isPasswordStrongEnough = this.passwordStrength === 'strong';
  }

  passwordsMatch(): boolean {
    if (!this.signupForm.password || !this.signupForm.confirmPassword) {
      return true; // prevent early mismatch error
    }
    return this.signupForm.password === this.signupForm.confirmPassword;
  }

  routeToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }
}
