import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { NavbarComponent } from '../../frontoffice/navbar/navbar.component';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { ProfileResponse } from '../../models/ProfileResponse.models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './profil-client.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {

  profile: ProfileResponse | null = null;
  chargement = true;

  // --- édition profil ---
  modeEdition = false;
  enregistrementEnCours = false;
  erreur = '';
  succes = '';

  form: FormGroup;

  // --- changement mot de passe ---
  modeChangementMdp = false;
  enregistrementMdpEnCours = false;
  erreurMdp = '';

  formMdp: FormGroup;

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: [''],
      site: [''],
      departement: ['']
    });

    this.formMdp = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.mdpIdentiquesValidator
    });
  }

  ngOnInit() {
    this.chargerProfil();
  }

  chargerProfil() {
    const user = this.authService.getCurrentUser();

    if (!user?.id) {
      this.chargement = false;
      return;
    }

    this.chargement = true;

    this.profileService.getProfile(user.id).subscribe({
      next: (res: any) => {
        this.profile = {
          ...res,
          matricule: res.matricule ?? ''
        };
        this.chargement = false;
      },
      error: (err) => {
        console.error('Erreur chargement profil', err);
        this.chargement = false;
      }
    });
  }

  get initiale(): string {
    if (!this.profile?.nom) {
      return '';
    }
    return this.profile.nom.charAt(0).toUpperCase();
  }

  get roleLabel(): string {
    if (!this.profile?.role) {
      return '';
    }
    return this.profile.role.replace('ROLE_', '');
  }

  // ===================== ÉDITION PROFIL =====================

  ouvrirEdition(): void {
    if (!this.profile) return;

    this.form.patchValue({
      nom: this.profile.nom,
      email: this.profile.email,
      telephone: this.profile.telephone ?? '',
      site: this.profile.site ?? '',
      departement: this.profile.departement ?? ''
    });

    this.erreur = '';
    this.succes = '';
    this.modeEdition = true;
  }

  annulerEdition(): void {
    this.modeEdition = false;
    this.erreur = '';
  }

  enregistrer(): void {
    if (this.form.invalid || !this.profile) {
      this.form.markAllAsTouched();
      return;
    }

    const profileId = this.profile.id;

    this.enregistrementEnCours = true;
    this.erreur = '';

    const payload = {
      nom: this.form.value.nom,
      email: this.form.value.email,
      telephone: this.form.value.telephone,
      site: this.form.value.site,
      departement: this.form.value.departement
    };

    this.profileService.updateProfile(profileId, payload).subscribe({
      next: (res: any) => {
        this.profile = {
          ...res,
          matricule: res.matricule ?? ''
        };
        this.enregistrementEnCours = false;
        this.modeEdition = false;
        this.succes = 'Profil mis à jour avec succès';

        setTimeout(() => (this.succes = ''), 3000);
      },
      error: (err) => {
        console.error('Erreur mise à jour profil', err);
        this.enregistrementEnCours = false;

        if (err.status === 409) {
          this.erreur = 'Cet email est déjà utilisé';
        } else {
          this.erreur = 'Une erreur est survenue, réessayez';
        }
      }
    });
  }

  // ===================== CHANGEMENT MOT DE PASSE =====================

  private mdpIdentiquesValidator(group: AbstractControl): ValidationErrors | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mdpDifferents: true };
  }

  ouvrirChangementMdp(): void {
    this.formMdp.reset();
    this.erreurMdp = '';
    this.succes = '';
    this.modeChangementMdp = true;
  }

  annulerChangementMdp(): void {
    this.modeChangementMdp = false;
    this.erreurMdp = '';
  }

  changerMotDePasse(): void {
    if (this.formMdp.invalid || !this.profile) {
      this.formMdp.markAllAsTouched();
      return;
    }

    const profileId = this.profile.id;

    this.enregistrementMdpEnCours = true;
    this.erreurMdp = '';

    const payload = {
      oldPassword: this.formMdp.value.oldPassword,
      newPassword: this.formMdp.value.newPassword
    };

    this.profileService.changePassword(profileId, payload).subscribe({
      next: () => {
        this.enregistrementMdpEnCours = false;
        this.modeChangementMdp = false;
        this.succes = 'Mot de passe modifié avec succès';
        setTimeout(() => (this.succes = ''), 3000);
      },
      error: (err) => {
        this.enregistrementMdpEnCours = false;
        this.erreurMdp = err.error?.error || 'Une erreur est survenue';
      }
    });
  }
}