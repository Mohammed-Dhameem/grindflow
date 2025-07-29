import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css', 
  standalone: true
})
export class AppComponent {
  title = 'Grindflow';
  static api_url = "http://localhost:8080/api";
}
