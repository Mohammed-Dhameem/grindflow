import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { error } from 'console';
import { EmailVerification } from '../model/email-verification';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  verifyForm = new EmailVerification();
  loading = false;
  message: string | null = null;
  showOtpInput: boolean = false;
  showOTP: boolean = false;

  onVerifySubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    this.loading = true;
    this.message = null;

    if (!this.showOtpInput) {
      this.authService.verifyAndSendOTP(this.verifyForm.email!).subscribe({
        next: (res) => {
          this.loading = false;
          this.message = res?.body?.message || 'If the email exists, an OTP has been sent';
          this.showOtpInput = true;
        },
        error: (err) => {
          this.loading = false;
          this.message = err?.error?.message || 'Failed to send OTP. Please try again later.';
        }
      });
    } else {
      this.authService.verifyOTP(this.verifyForm).subscribe({
        next: (res) => {
          this.loading = false;
          this.message = res?.body?.message || 'OTP verified successfully!';

          sessionStorage.setItem('resetEmail', this.verifyForm.email!);
          this.router.navigate(['/reset-password']);

          form.resetForm();
          this.showOtpInput = false;
        },
        error: (err) => {
          this.loading = false;
          this.message = err?.error?.message || 'OTP verification failed. Please try again.';
        }
      });
    }
  }


}
