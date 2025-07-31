// login-signup.component.ts
import { Component, Inject, OnInit, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../authentication/service/auth.service';
import { LoginRequest } from '../authentication/model/login-request';
import { SignupRequest } from '../authentication/model/signup-request';
import { environment } from '../authentication/environment/environment';
import { fade } from '../animations/animations';

declare const google: any;

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  animations: [fade],
})

export class LandingPageComponent implements OnInit, AfterViewInit {
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

  private isBrowser: boolean;

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
        error: () => { }
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
    if (this.isBrowser) {
      setTimeout(() => this.initGoogleLogin(), 50);
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
      }
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
    const el = document.getElementById('googleBtn');
    if (!el || typeof google === 'undefined' || !google.accounts) {
      setTimeout(() => this.initGoogleLogin(), 100);
      return;
    }

    el.innerHTML = ''; // clear existing render
    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: this.handleCredentialResponse.bind(this),
    });

    google.accounts.id.renderButton(el, {
      theme: "filled_black",
      size: "large",
      type: "standard",
      shape: "pill",
      logo_alignment: "left"
    });

    google.accounts.id.prompt(); // Optional, shows one-tap
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

  checkPasswordStrength(password: string): void {
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
}
