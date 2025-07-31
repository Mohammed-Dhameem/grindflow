import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SignupRequest } from '../model/signup-request';
import { LoginRequest } from '../model/login-request';
import { AppComponent } from '../../app.component';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private http: HttpClient) { }

  signup(data: SignupRequest): Observable<HttpResponse<any>> {
    return this.http.post<any>(
      `${AppComponent.api_url}/auth/signup`,
      data,
      { observe: 'response', withCredentials: true }
    );
  }

  login(data: LoginRequest): Observable<HttpResponse<any>> {
    return this.http.post<any>(
      `${AppComponent.api_url}/auth/login`,
      data,
      { observe: 'response', withCredentials: true }
    );
  }

  checkLogin(): Observable<any> {
    return this.http.get(
      `${AppComponent.api_url}/auth/protected`,
      {
        withCredentials: true,
        observe: 'response'
      }
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${AppComponent.api_url}/auth/logout`, {}, {
      withCredentials: true
    });
  }

  googleLogin(idToken: string): Observable<any> {
    return this.http.post(`${AppComponent.api_url}/auth/google`, { idToken }, {
      withCredentials: true,
      observe: 'response'
    });
  }  

}