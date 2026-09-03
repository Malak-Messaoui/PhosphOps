import { Component, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { createIcons, icons } from 'lucide';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        // setTimeout(0) laisse Angular finir de peindre le nouveau DOM avant de générer les icônes
        setTimeout(() => {
          createIcons({ icons });
        }, 0);
      });
  }

  ngAfterViewInit(): void {
    createIcons({ icons });
  }
}