import { Component } from '@angular/core';
import { PasswordReset } from '../model/password-reset';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-reset-password',
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {

  resetForm = new PasswordReset();

  ngOnInit() {
    this.resetForm.email = sessionStorage.getItem('resetEmail') || '';
  }

  showPassword = false;
  passwordTyped = false;
  passwordStrength = '';
  passwordStrengthLabel = '';
  isPasswordStrongEnough = false;
  loading = false;
  message = '';

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  checkPasswordStrength(password: string) {
    this.passwordTyped = !!password;
    if (!password) {
      this.passwordStrength = '';
      this.passwordStrengthLabel = '';
      this.isPasswordStrongEnough = false;
      return;
    }

    // Simple strength check logic
    if (password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password) && /[@$!%*?&]/.test(password)) {
      this.passwordStrength = 'strong';
      this.passwordStrengthLabel = 'Strong';
      this.isPasswordStrongEnough = true;
    } else if (password.length >= 8) {
      this.passwordStrength = 'medium';
      this.passwordStrengthLabel = 'Medium';
      this.isPasswordStrongEnough = false;
    } else {
      this.passwordStrength = 'weak';
      this.passwordStrengthLabel = 'Weak';
      this.isPasswordStrongEnough = false;
    }
  }

  passwordsMatch() {
    return this.resetForm.newPassword === this.resetForm.confirmNewPassword;
  }

  onPasswordResetSubmit(form: any) {
    if (form.valid && this.passwordsMatch()) {
      this.loading = true;
      // Call reset API here

      console.log(this.resetForm);
      // setTimeout(() => {
      //   this.loading = false;
      //   this.message = 'Password updated successfully ✅';
      // }, 1500);
    }
  }

}
