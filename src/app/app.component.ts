import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StartComponent } from './features/start/pages/start.component';
import { MainComponent } from './features/main/pages/main.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, StartComponent, MainComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'mcdonalds-kiosk';
}
