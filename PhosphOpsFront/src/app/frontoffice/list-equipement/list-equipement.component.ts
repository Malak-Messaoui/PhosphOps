import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from "../navbar/navbar.component";
import { EquipementService } from '../../services/equipement.service';
import { Equipement, EtatEquipement } from '../../models/equipement.model';

type FiltreEtat = 'tous' | EtatEquipement;

@Component({
  selector: 'app-list-equipement',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  templateUrl: './list-equipement.component.html',
  styleUrl: './list-equipement.component.css'
})
export class ListEquipementComponent implements OnInit {

  equipements: Equipement[] = [];
  chargement = true;

  recherche = '';
  filtreActif: FiltreEtat = 'tous';

  EtatEquipement = EtatEquipement; // exposé au template pour comparaisons

  // --- Popup détail ---
  selectedEquipement: Equipement | null = null;
  historique: any[] = []; // remplace `any` par ton modèle Intervention si tu en as un

  constructor(
    private equipementService: EquipementService
    // private interventionService: InterventionService // décommente si tu as ce service
  ) {}

  ngOnInit(): void {
    this.equipementService.getAll().subscribe({
      next: (data) => {
        this.equipements = data;
        this.chargement = false;
      },
      error: (err) => {
        console.error('Erreur chargement équipements', err);
        this.chargement = false;
      }
    });
  }

  etatLabel(etat: EtatEquipement): string {
    switch (etat) {
      case EtatEquipement.PANNE: return 'En panne';
      case EtatEquipement.MAINTENANCE: return 'Maintenance';
      case EtatEquipement.FONCTIONNEL: return 'Fonctionnel';
      default: return etat;
    }
  }

  etatClasse(etat: EtatEquipement): string {
    return etat.toLowerCase();
  }

  setFiltre(f: FiltreEtat): void {
    this.filtreActif = f;
  }

  get equipementsFiltres(): Equipement[] {
    const terme = this.recherche.trim().toLowerCase();

    return this.equipements.filter((eq) => {
      const matchFiltre =
        this.filtreActif === 'tous' || eq.etatEquipement === this.filtreActif;

      const matchRecherche =
        !terme ||
        eq.matriculeEquipement?.toLowerCase().includes(terme) ||
        eq.categorieEquipement?.toLowerCase().includes(terme);

      return matchFiltre && matchRecherche;
    });
  }

  // --- Gestion du popup ---
  openDetail(eq: Equipement): void {
    this.selectedEquipement = eq;
    this.historique = [];

    // Si tu as un service d'historique des interventions par équipement, décommente :
    // this.interventionService.getByEquipement(eq.idEquipement).subscribe({
    //   next: (data) => this.historique = data,
    //   error: (err) => console.error('Erreur chargement historique', err)
    // });
  }

  closeDetail(): void {
    this.selectedEquipement = null;
    this.historique = [];
  }
}