import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SignupRequest } from '../model/signup-request';
import { LoginRequest } from '../model/login-request';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  signup(data: SignupRequest): Observable<HttpResponse<any>> {
    return this.http.post<any>(
      `${this.baseUrl}/auth/signup`,
      data,
      { observe: 'response' }
    );
  }

  login(data: LoginRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, data);
  }
}
