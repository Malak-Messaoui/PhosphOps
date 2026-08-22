import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-oauth2-select-role',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './oauth2-select-role.component.html'
})
export class Oauth2SelectRoleComponent implements OnInit {

  form: FormGroup;
  envoiEnCours = false;
  erreur: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      email: [{ value: '', disabled: true }],
      nom: ['', Validators.required],
      matricule: ['', Validators.required],
      telephone: ['', Validators.required],
      site: ['', Validators.required],
      departement: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.form.patchValue({
        email: params['email'] ?? '',
        nom: params['name'] ?? ''
      });
    });
  }

  soumettre() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.envoiEnCours = true;
    this.erreur = null;

    this.authService.completeOAuthRegistration({
      email: this.form.getRawValue().email,
      nom: this.form.value.nom,
      matricule: this.form.value.matricule,
      telephone: this.form.value.telephone,
      site: this.form.value.site,
      departement: this.form.value.departement
    }).subscribe({
      next: () => this.router.navigate(['/acceuil']),
      error: (err) => {
        this.envoiEnCours = false;
        this.erreur = err?.error?.error ?? 'Une erreur est survenue.';
      }
    });
  }
}