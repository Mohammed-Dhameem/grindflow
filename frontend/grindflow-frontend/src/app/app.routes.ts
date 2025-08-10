import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { AuthGuard } from './authentication/guard/auth.guard';
import { AuthPageComponent } from './authentication/auth-page/auth-page.component';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './authentication/reset-password/reset-password.component';
import { ForgotPasswordGuard } from './authentication/guard/forgot-password-guard.guard';

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent
  },
  {
    path: 'auth',
    component: AuthPageComponent
  },
  {
    path: 'home',
    component: HomePageComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    // canActivate: [ForgotPasswordGuard]
  },
  {
    path: '**',
    redirectTo: '/auth'
  }
];
