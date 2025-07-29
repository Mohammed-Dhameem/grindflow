import { Routes } from '@angular/router';
import { AuthGuard } from './authentication/guard/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./landing-page/landing-page.component').then((m) => m.LandingPageComponent),
  },
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./authentication/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'auth/signup',
    loadComponent: () =>
      import('./authentication/signup/signup.component').then((m) => m.SignupComponent),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./home-page/home-page.component').then((m) => m.HomePageComponent),
    canActivate: [AuthGuard],
  }
];
