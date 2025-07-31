import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppComponent } from '../../app.component';
import { environment } from '../../authentication/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class HomePageService {

  constructor(private http: HttpClient) { }

  trigger(): any {
    return this.http.get(`${environment.api_url}/homepage/trigger`, {
      withCredentials: true // ✅ send cookies like JWT
    });
  }

}
