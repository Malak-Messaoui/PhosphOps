import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { AuthService } from '../../services/auth.service';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr);

@Component({
  selector: 'app-acceuil',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './acceuil.component.html',
  styleUrl: './acceuil.component.css'
})
export class AcceuilComponent {

  afficherToast = false;
  aujourdHui = new Date();

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.queryParams.subscribe(params => {
      if (params['panneAjoutee'] === '1') {
        this.afficherToast = true;
        this.router.navigate([], { queryParams: {}, replaceUrl: true });
        setTimeout(() => (this.afficherToast = false), 3000);
      }
    });
  }

  get nomUtilisateur(): string {
    return this.authService.getCurrentUser()?.name ?? 'Technicien';
  }
}