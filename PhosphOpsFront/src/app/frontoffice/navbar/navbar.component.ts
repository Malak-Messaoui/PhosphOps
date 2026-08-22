import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { createIcons, icons } from 'lucide';
import { ChatbotWidgetComponent } from "../chatbot-widget/chatbot-widget.component";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ChatbotWidgetComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  user: any = null;
  dropdownOuvert = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
  }

  get initiale(): string {
    if (!this.user?.name) {
      return '';
    }
    return this.user.name.charAt(0).toUpperCase();
  }

  toggleDropdown() {
    this.dropdownOuvert = !this.dropdownOuvert;
    if (this.dropdownOuvert) {
      setTimeout(() => createIcons({ icons }), 0);
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.dropdownOuvert = false;
    }
  }

  allerProfil() {
    this.dropdownOuvert = false;
    this.router.navigate(['/profil-client']);
  }

  logout() {
    this.dropdownOuvert = false;
    this.authService.logout();
  }
}