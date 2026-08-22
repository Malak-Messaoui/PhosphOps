import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, computed, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Personnel, PersonnelUpdate, RolePersonnel, initiales } from '../../models/personnel.model';
import { PersonnelService } from '../../services/personnel.service';
import { MenuComponent } from '../menu/menu.component';
import { HeaderComponent } from '../header/header.component';

declare const lucide: any;

type ModeModal = 'creation' | 'edition' | 'consultation';

@Component({
  selector: 'app-personnel',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MenuComponent, HeaderComponent],
  templateUrl: './personnel.component.html',
  styleUrl: './personnel.component.css',
})
export class PersonnelComponent implements OnInit, AfterViewInit {
  readonly initiales = initiales;
  readonly roles = Object.values(RolePersonnel);
  readonly filtres: Array<RolePersonnel | 'tous'> = [
    'tous',
    RolePersonnel.TECHNICIEN,
    RolePersonnel.RESPONSABLE_MAINTENANCE,
    RolePersonnel.CHEF_DEPARTEMENT,
  ];

  personnel = signal<Personnel[]>([]);
  filtreRole = signal<RolePersonnel | 'tous'>('tous');
  recherche = signal('');
  modalOuverte = signal(false);
  modeModal = signal<ModeModal>('creation');
  personnelSelectionne = signal<Personnel | null>(null);
  menuMobileOuvert = signal(false);
  envoiEnCours = false;

  personnelFiltre = computed(() => {
    const role = this.filtreRole();
    const q = this.recherche().trim().toLowerCase();
    return this.personnel().filter((p) => {
      const matchRole = role === 'tous' || p.role === role;
      const matchRecherche = !q || `${p.nom} ${p.email}`.toLowerCase().includes(q);
      return matchRole && matchRecherche;
    });
  });

  form: FormGroup;

  constructor(private fb: FormBuilder, private personnelService: PersonnelService) {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      matricule: ['', Validators.required],
      role: [RolePersonnel.TECHNICIEN, Validators.required],
    });
  }

  ngOnInit(): void {
    this.charger();
  }

  ngAfterViewInit(): void {
    // Une seule fois après le premier rendu — évite la boucle infinie
    // de requestAnimationFrame causée par ngAfterViewChecked
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  charger(): void {
    this.personnelService.getAll().subscribe({
      next: (data) => {
        this.personnel.set(data);
        // Ré-invoque lucide après le chargement des données,
        // car *ngFor va injecter de nouvelles icônes <i data-lucide="...">
        if (typeof lucide !== 'undefined') {
          setTimeout(() => lucide.createIcons(), 0);
        }
      },
      error: (err) => console.error('Erreur chargement personnel', err),
    });
  }

  onFiltreChange(role: RolePersonnel | 'tous'): void {
    this.filtreRole.set(role);
  }

  onRechercheChange(valeur: string): void {
    this.recherche.set(valeur);
  }

  toggleMenuMobile(): void {
    this.menuMobileOuvert.update((v) => !v);
  }

  fermerMenuMobile(): void {
    this.menuMobileOuvert.set(false);
  }

  ouvrirModal(): void {
    this.modeModal.set('creation');
    this.personnelSelectionne.set(null);
    this.form.reset({
      nom: '',
      email: '',
      matricule: '',
      role: RolePersonnel.TECHNICIEN,
    });
    this.form.enable();
    this.modalOuverte.set(true);
  }

  consulter(p: Personnel): void {
    this.modeModal.set('consultation');
    this.personnelSelectionne.set(p);
    this.form.setValue({
      nom: p.nom,
      email: p.email,
      matricule: p.matricule,
      role: p.role,
    });
    this.form.disable();
    this.modalOuverte.set(true);
  }

  modifier(p: Personnel): void {
    this.modeModal.set('edition');
    this.personnelSelectionne.set(p);
    this.form.setValue({
      nom: p.nom,
      email: p.email,
      matricule: p.matricule,
      role: p.role,
    });
    this.form.enable();
    this.modalOuverte.set(true);
  }

  fermerModal(): void {
    this.modalOuverte.set(false);
    this.personnelSelectionne.set(null);
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.fermerModal();
    }
  }

  soumettre(): void {
    if (this.modeModal() === 'consultation') {
      this.fermerModal();
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.envoiEnCours = true;
    const v = this.form.getRawValue();
    const payload = {
      nom: v.nom!,
      email: v.email!,
      matricule: v.matricule!,
      role: v.role!,
    };

    const requete$ =
      this.modeModal() === 'edition' && this.personnelSelectionne()
        ? this.personnelService.update(this.personnelSelectionne()!.id, payload)
        : this.personnelService.create(payload);

    requete$.subscribe({
      next: () => {
        this.envoiEnCours = false;
        this.fermerModal();
        this.charger();
      },
      error: (err) => {
        this.envoiEnCours = false;
        console.error('Erreur enregistrement utilisateur', err);
      },
    });
  }

  supprimer(id: number): void {
    if (!confirm('Supprimer cet utilisateur ?')) return;
    this.personnelService.delete(id).subscribe({
      next: () => this.charger(),
      error: (err) => console.error('Erreur suppression', err),
    });
  }
}