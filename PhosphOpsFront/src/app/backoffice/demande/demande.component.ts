import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemandeService, DemandeMaintenance, Technicien } from '../../services/demande.service';
import { MenuComponent } from '../menu/menu.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-demandes',
  standalone: true,
  imports: [CommonModule, MenuComponent, HeaderComponent],
  templateUrl: './demande.component.html',
  styleUrl: './demande.component.css'
})
export class DemandeComponent implements OnInit {

  demandes: DemandeMaintenance[] = [];
  techniciens: Technicien[] = [];
  filtreActif = 'TOUS';
  chargement = false;

  // demande dont on affiche le select technicien
  demandeAffectationId: number | null = null;

  menuMobileOuvert: boolean = false; // <-- corrigé : 'any' remplacé par un vrai boolean

  constructor(private demandeService: DemandeService) {}

  ngOnInit() {
    this.charger();
    this.demandeService.getTechniciens().subscribe({
      next: (list) => (this.techniciens = list)
    });
  }

  charger() {
    this.chargement = true;
    const statut = this.filtreActif === 'TOUS' ? undefined : this.filtreActif;

    this.demandeService.getAll(statut).subscribe({
      next: (list) => {
        this.demandes = list;
        this.chargement = false;
      },
      error: () => (this.chargement = false)
    });
  }

  filtrer(statut: string) {
    this.filtreActif = statut;
    this.charger();
  }

  accepter(id: number) {
    this.demandeService.accepter(id).subscribe(() => this.charger());
  }

  refuser(id: number) {
    const commentaire = prompt('Raison du refus (optionnel) :') ?? undefined;
    this.demandeService.refuser(id, commentaire).subscribe(() => this.charger());
  }

  ouvrirAffectation(id: number) {
    this.demandeAffectationId = this.demandeAffectationId === id ? null : id;
  }

  affecter(id: number, idTechnicien: string) {
    if (!idTechnicien) return;
    this.demandeService.affecter(id, Number(idTechnicien)).subscribe(() => {
      this.demandeAffectationId = null;
      this.charger();
    });
  }

  toggleMenuMobile(): void {
    this.menuMobileOuvert = !this.menuMobileOuvert;
  }

  fermerMenuMobile(): void {
    this.menuMobileOuvert = false; // <-- corrigé : ne throw plus, ferme réellement le menu
  }
}