import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { fade, fadeSlide } from '../animations/animations';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatListModule,
    MatIconModule
  ],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  animations: [fadeSlide, fade]
})
export class LandingPageComponent {
  showFeatures: boolean = false;

  hide = () => this.showFeatures = false;
  view = () => this.showFeatures = true;
}
