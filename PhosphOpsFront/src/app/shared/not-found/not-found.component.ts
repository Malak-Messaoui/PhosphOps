// src/app/shared/not-found/not-found.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent {
  constructor(private router: Router) {}

  goHome(): void {
    const role = localStorage.getItem('RoleUserConnect');
    if (role === 'ROLE_ADMIN')       this.router.navigateByUrl('/admin');
    else if (role === 'ROLE_COACH')  this.router.navigateByUrl('/coach');
    else if (role === 'ROLE_PLAYER') this.router.navigateByUrl('/client');
    else                             this.router.navigateByUrl('/login');
  }
}