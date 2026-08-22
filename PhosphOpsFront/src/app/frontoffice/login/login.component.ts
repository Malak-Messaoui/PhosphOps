import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  envoiEnCours = false;
  erreur: string | null = null;

  afficherPopup = false;
  forgotForm: FormGroup;
  forgotEnCours = false;
  forgotErreur: string | null = null;
  forgotSucces: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['error'] === 'admin_google_blocked') {
        this.erreur = 'Ce compte est un compte administrateur. Veuillez utiliser la page de connexion admin.';
      }
    });
  }

  soumettre() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.envoiEnCours = true;
    this.erreur = null;

    this.authService.login(this.form.value).subscribe({
      next: () => {
        this.envoiEnCours = false;
        this.router.navigate(['/acceuil']);
      },
      error: (err) => {
        this.envoiEnCours = false;
        this.erreur = err?.error?.message
          ?? 'Email ou mot de passe incorrect.';
      }
    });
  }

  connexionGoogle() {
    this.authService.loginWithGoogle();
  }

  ouvrirPopup() {
    this.afficherPopup = true;
    this.forgotErreur = null;
    this.forgotSucces = null;
    this.forgotForm.reset();
  }

  fermerPopup() {
    this.afficherPopup = false;
  }

  soumettreForgot() {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    if (this.forgotForm.value.newPassword !== this.forgotForm.value.confirmPassword) {
      this.forgotErreur = 'Les mots de passe ne correspondent pas.';
      return;
    }

    this.forgotEnCours = true;
    this.forgotErreur = null;
    this.forgotSucces = null;

    this.authService.forgotPassword({
      email: this.forgotForm.value.email,
      newPassword: this.forgotForm.value.newPassword
    }).subscribe({
      next: () => {
        this.forgotEnCours = false;
        this.forgotSucces = 'Mot de passe réinitialisé avec succès !';
        setTimeout(() => this.fermerPopup(), 1800);
      },
      error: (err) => {
        this.forgotEnCours = false;
        this.forgotErreur = err?.error?.error ?? 'Une erreur est survenue.';
      }
    });
  }
}