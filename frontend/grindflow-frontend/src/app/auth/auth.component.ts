import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-auth',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
})
export class AuthComponent implements OnInit {
  authForm!: FormGroup;
  isLoginMode: boolean = true;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.initForm();
  }

  private initForm(): void {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      ...(this.isLoginMode ? {} : { name: ['', Validators.required] }),
    });
  }

  onSubmit(): void {
    console.log(this.authForm);
    if (this.authForm.invalid) return;

    const { email, password, name } = this.authForm.value;

    if (this.isLoginMode) {
      this.auth.login({ email, password }).subscribe({
        next: (res) => {
          console.log('Login successful', res);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => console.error('Login error', err),
      });
    } else {
      this.auth.signup({ name, email, password }).subscribe({
        next: (res) => {
          console.log('Signup successful', res);
          this.router.navigate(['/login']);
        },
        error: (err) => console.error('Signup error', err),
      });
    }
  }
}
