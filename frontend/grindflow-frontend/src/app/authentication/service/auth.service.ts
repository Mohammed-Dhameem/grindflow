import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SignupRequest } from '../model/signup-request';
import { LoginRequest } from '../model/login-request';
import { environment } from '../environment/environment';
import { EmailVerification } from '../model/email-verification';
import { PasswordReset } from '../model/password-reset';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private http: HttpClient) { }

  signup(data: SignupRequest): Observable<HttpResponse<any>> {
    return this.http.post<any>(
      `${environment.api_url}/auth/signup`,
      data,
      { observe: 'response', withCredentials: true }
    );
  }

  login(data: LoginRequest): Observable<HttpResponse<any>> {
    return this.http.post<any>(
      `${environment.api_url}/auth/login`,
      data,
      { observe: 'response', withCredentials: true }
    );
  }

  checkLogin(): Observable<any> {
    return this.http.get(
      `${environment.api_url}/auth/protected`,
      {
        withCredentials: true,
        observe: 'response'
      }
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${environment.api_url}/auth/logout`, {}, {
      withCredentials: true
    });
  }

  googleLogin(idToken: string): Observable<any> {
    return this.http.post(`${environment.api_url}/auth/google`, { idToken }, {
      withCredentials: true,
      observe: 'response'
    });
  }

  verifyAndSendOTP(email: string): Observable<HttpResponse<any>> {
    return this.http.post(
      `${environment.api_url}/auth/verifyAndSendOTP`,
      { email },
      { observe: 'response', withCredentials: true } // important
    );
  }

  verifyOTP(payload: EmailVerification): Observable<HttpResponse<any>>  {
    return this.http.post(
      `${environment.api_url}/auth/verifyOTP`,
      payload,
      { observe: 'response', withCredentials: true } // important
    );
  }

  resetPassword(resetForm: PasswordReset): Observable<HttpResponse<any>> {
    return this.http.post(
      `${environment.api_url}/auth/resetPassword`,
      resetForm,
      { observe: 'response', withCredentials: true } // important
    );
  }
}