import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { PanneService } from '../../services/panne.service';

@Component({
  selector: 'app-panne',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './panne.component.html',
  styleUrl: './panne.component.css'
})
export class PanneComponent {

  form: FormGroup;
  photoFile: File | null = null;
  photoPreview: string | null = null;
  envoiEnCours = false;
  erreur: string | null = null;

  typesPanne = ['MECANIQUE', 'ELECTRIQUE', 'INFORMATIQUE', 'LOGISTIQUE'];
  priorites = [
    { value: 'URGENT', label: 'Urgente' },
    { value: 'NORMAL', label: 'Normale' },
    { value: 'FAIBLE', label: 'Faible' }
  ];

  constructor(
    private fb: FormBuilder,
    private panneService: PanneService,
    private router: Router
  ) {
    this.form = this.fb.group({
      typePanne: ['', Validators.required],
      descPanne: ['', Validators.required],
      priorite: ['NORMAL', Validators.required],
      matriculeEquipement: ['', Validators.required]
    });
  }

  choisirPriorite(valeur: string) {
    this.form.patchValue({ priorite: valeur });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.photoFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => (this.photoPreview = reader.result as string);
      reader.readAsDataURL(this.photoFile);
    }
  }

 soumettre() {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  this.envoiEnCours = true;
  this.erreur = null;

  this.panneService.declarer(this.form.value, this.photoFile).subscribe({
    next: () => {
      this.envoiEnCours = false;
      this.router.navigate(['/acceuil'], { queryParams: { panneAjoutee: '1' } });
    },
    error: (err) => {
      this.envoiEnCours = false;
      this.erreur = err?.error?.message ?? 'Erreur lors de la déclaration.';
    }
  });
}

  
}