import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SignupRequest } from '../model/signup-request';
import { LoginRequest } from '../model/login-request';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  signup(data: SignupRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, data);
  }

  login(data: LoginRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, data);
  }
}
