import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SignupRequest } from '../model/signup-request';
import { LoginRequest } from '../model/login-request';
import { AppComponent } from '../../app.component';
import { environment } from '../environment/environment';

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

}