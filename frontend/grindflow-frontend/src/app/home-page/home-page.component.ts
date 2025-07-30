import { Component } from '@angular/core';
import { HomePageService } from './service/home-page.service';
import { AuthService } from '../authentication/service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

  constructor(
    private homepageService: HomePageService,
    private authService: AuthService,
    private router: Router
  ) { }

  triggercheck() {
    this.homepageService.trigger().subscribe({
      next: (data: any) => {
        console.log(data);
      }
    })
  }

  logout() {
    this.authService.logout().subscribe(() => this.router.navigate(['auth/login']));
  }

}
