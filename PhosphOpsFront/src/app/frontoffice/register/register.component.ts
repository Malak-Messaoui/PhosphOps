import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';

function motDePasseIdentiquesValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { motsDePasseDifferents: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  form: FormGroup;

  erreur = '';
  envoiEnCours = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {

    this.form = this.fb.group({

      nom: ['', Validators.required],

      matricule: ['', Validators.required],

      email: ['', [Validators.required, Validators.email]],

      telephone: [''],

      site: [''],

      departement: [''],

      password: ['', [Validators.required, Validators.minLength(6)]],

      confirmPassword: ['', Validators.required]

    }, {
      validators: motDePasseIdentiquesValidator
    });

  }

  soumettre(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.envoiEnCours = true;
    this.erreur = '';

    const { nom, matricule, email, telephone, site, departement, password } = this.form.value;

    this.authService
      .register({ nom, matricule, email, telephone, site, departement, password })
      .subscribe({

        next: () => {
          this.envoiEnCours = false;
          this.router.navigateByUrl('/acceuil');
        },

        error: (err) => {
          this.envoiEnCours = false;

          if (err.status === 409) {
            this.erreur = 'Cet email est déjà utilisé';
          } else {
            this.erreur = 'Une erreur est survenue, réessayez';
          }
        }

      });

  }

}