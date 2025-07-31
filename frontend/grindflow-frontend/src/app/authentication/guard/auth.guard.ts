import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): Observable<boolean> {
    return this.authService.checkLogin().pipe(
      map((res) => {
        console.log('✅ AuthGuard: Authenticated', res);
        return true;
      }),
      catchError((err) => {
        console.error('❌ AuthGuard: Not authenticated', err);
        this.router.navigate(['']);
        return of(false);
      })
    );
  }

}
