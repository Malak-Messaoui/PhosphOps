import { Component, Input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  @Input() menuMobileOuvert = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  get user() {
    return this.authService.getCurrentUser();
  }

  get initiale(): string {
    if (!this.user?.name) {
      return '';
    }
    return this.user.name.charAt(0).toUpperCase();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/admin-login']);
  }
}