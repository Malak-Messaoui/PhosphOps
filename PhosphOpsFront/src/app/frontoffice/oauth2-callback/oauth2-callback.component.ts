import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-oauth2-callback',
  standalone: true,
  template: `<div style="display:flex;align-items:center;justify-content:center;height:100vh">Connexion en cours…</div>`
})
export class Oauth2CallbackComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const { token, email, role, id } = params;

      if (token && email && role && id) {
        this.authService.storeSession(token, +id, email, email.split('@')[0], role);
        this.router.navigate(['/acceuil']);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
}