import { Component } from '@angular/core';
import { HomePageService } from './service/home-page.service';

@Component({
  selector: 'app-home-page',
  imports: [],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
  standalone: true
})
export class HomePageComponent {

  constructor(private homepageService: HomePageService) {}

  trigger() {
    this.homepageService.getData().subscribe({
      next: (data) => {
        console.log(data);
      }
    })
  }

}
