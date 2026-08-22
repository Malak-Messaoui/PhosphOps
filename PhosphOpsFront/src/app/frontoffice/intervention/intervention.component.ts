import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { InterventionService } from '../../services/intervention.service';
import { InterventionDetail, InterventionListItem, Piece, PieceUtilisee } from '../../models/intervention.model';

@Component({
  selector: 'app-intervention',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './intervention.component.html',
  styleUrl: './intervention.component.css'
})
export class InterventionComponent implements OnInit {
  interventions: InterventionListItem[] = [];

  // état du modal / détail
  selected: InterventionDetail | null = null;
  compteRendu = '';
  pieceQuery = '';
  suggestions: Piece[] = [];
  piecesAjoutees: PieceUtilisee[] = [];
  loading = false;

  constructor(private interventionService: InterventionService) {}

  ngOnInit(): void {
    this.loadInterventions();
  }

  loadInterventions(): void {
    this.interventionService.getMesInterventions().subscribe({
      next: (data) => (this.interventions = data),
      error: (err) => console.error('Erreur chargement interventions', err)
    });
  }

  openDetail(item: InterventionListItem): void {
    this.loading = true;
    this.interventionService.getDetail(item.idIntervention).subscribe({
      next: (detail) => {
        this.selected = detail;
        this.compteRendu = detail.compteRendu ?? '';
        this.piecesAjoutees = detail.piecesUtilisees ?? [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement détail', err);
        this.loading = false;
      }
    });
  }

  closeModal(): void {
    this.selected = null;
    this.compteRendu = '';
    this.pieceQuery = '';
    this.suggestions = [];
    this.piecesAjoutees = [];
  }

  demarrer(): void {
    if (!this.selected) return;
    this.interventionService.demarrer(this.selected.idIntervention).subscribe({
      next: (detail) => (this.selected = detail),
      error: (err) => console.error('Erreur démarrage', err)
    });
  }

  onPieceSearch(): void {
    if (this.pieceQuery.trim().length === 0) {
      this.suggestions = [];
      return;
    }
    this.interventionService.rechercherPieces(this.pieceQuery).subscribe({
      next: (data) => (this.suggestions = data),
      error: (err) => console.error('Erreur recherche pièces', err)
    });
  }

  ajouterPiece(piece: Piece): void {
    const existante = this.piecesAjoutees.find((p) => p.idPiece === piece.idPiece);
    if (existante) {
      existante.quantite++;
    } else {
      this.piecesAjoutees.push({ idPiece: piece.idPiece, nom: piece.nom, reference: piece.reference, quantite: 1 });
    }
  }

  retirerPiece(idPiece: number): void {
    this.piecesAjoutees = this.piecesAjoutees.filter((p) => p.idPiece !== idPiece);
  }

  cloturer(): void {
    if (!this.selected) return;
    const pieces = this.piecesAjoutees.map((p) => ({ idPiece: p.idPiece, quantite: p.quantite }));

    this.interventionService.cloturer(this.selected.idIntervention, this.compteRendu, pieces).subscribe({
      next: () => {
        this.closeModal();
        this.loadInterventions();
      },
      error: (err) => console.error('Erreur clôture', err)
    });
  }

  badgeClassStatut(status: string): string {
    return {
      PLANIFIEE: 'badge-statut-planifiee',
      EN_COURS: 'badge-statut-en_cours',
      TERMINEE: 'badge-statut-terminee'
    }[status] ?? '';
  }

  badgeClassPriorite(priorite: string): string {
    return {
      URGENT: 'badge-priorite-urgente',
      NORMAL: 'badge-priorite-normale',
      FAIBLE: 'badge-priorite-faible'
    }[priorite] ?? '';
  }
}