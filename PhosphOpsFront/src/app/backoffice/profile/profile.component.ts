import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';

declare const lucide: any;


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MenuComponent,
    HeaderComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit, AfterViewInit {

  menuMobileOuvert = false;

  user?: User;

  loading = true;

  editMode = false;

  formUser: any = {};

  constructor(
    private profileService: ProfileService,
    private authService: AuthService
  ) {}


  ngOnInit(): void {

    const currentUser =
      this.authService.getCurrentUser();

    if (currentUser) {

      this.profileService
        .getProfile(currentUser.id)
        .subscribe({

          next: (data) => {

            this.user = data;

            this.formUser = {
              nom: data.nom,
              email: data.email,
              matricule: data.matricule,
              telephone: data.telephone,
              departement: data.departement,
              site: data.site,
              dateEntree: data.dateEntree
            };

            this.loading = false;

            // Icônes ajoutées après le chargement des données async
            if (typeof lucide !== 'undefined') {
              setTimeout(() => lucide.createIcons(), 0);
            }

          },

          error: (err) => {

            console.error(
              "Erreur chargement profil",
              err
            );

            this.loading = false;

          }

        });

    } else {

      console.error(
        "Aucun utilisateur connecté"
      );

      this.loading = false;

    }

  }


  ngAfterViewInit(): void {

    // Une seule fois au premier rendu — évite la boucle infinie
    // de requestAnimationFrame causée par ngAfterViewChecked
    if (typeof lucide !== 'undefined') {

      lucide.createIcons();

    }

  }


  toggleMenuMobile(): void {

    this.menuMobileOuvert =
      !this.menuMobileOuvert;

  }


  fermerMenuMobile(): void {

    this.menuMobileOuvert = false;

  }


  modifier() {

    this.editMode = true;

  }


  annuler() {

    this.editMode = false;

  }


  sauvegarder() {

    if (!this.user) return;

    this.profileService
      .updateProfile(
        this.user.id,
        this.formUser
      )
      .subscribe({

        next: (data) => {

          this.user = data;
          this.editMode = false;

        },

        error: (err) => {

          console.error(
            "Erreur modification profil",
            err
          );

        }

      });

  }

}