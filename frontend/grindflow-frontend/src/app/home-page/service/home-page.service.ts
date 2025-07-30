import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppComponent } from '../../app.component';

@Injectable({
  providedIn: 'root'
})
export class HomePageService {

  constructor(private http: HttpClient) { }

  trigger(): any {
    return this.http.get(`${AppComponent.api_url}/homepage/trigger`, {
      withCredentials: true // ✅ send cookies like JWT
    });
  }

}
