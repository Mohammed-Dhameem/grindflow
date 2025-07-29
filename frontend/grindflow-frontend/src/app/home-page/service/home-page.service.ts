import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppComponent } from '../../app.component';

@Injectable({
  providedIn: 'root'
})
export class HomePageService {

  constructor(private http: HttpClient) { }

  getData(): Observable<any> {
    return this.http.get(`${AppComponent.api_url}/getdata`)
  }

}
