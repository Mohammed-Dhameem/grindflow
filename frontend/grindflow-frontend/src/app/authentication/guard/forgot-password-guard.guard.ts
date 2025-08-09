import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { catchError, map, Observable, of } from "rxjs";
import { environment } from "../environment/environment";

@Injectable({
  providedIn: 'root'
})

export class ForgotPasswordGuard implements CanActivate {
  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  canActivate(): Observable<boolean> {
    return this.http.get(`${environment.api_url}/auth/checkResetToken`, { withCredentials: true }).pipe(
      map(() => true),
      catchError(() => {
        this.router.navigate(['/forgot-password']);
        return of(false);
      })
    );
  }

}
