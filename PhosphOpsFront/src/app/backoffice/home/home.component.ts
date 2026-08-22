import { Component, AfterViewInit, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { MenuComponent } from '../menu/menu.component';
import { HeaderComponent } from '../header/header.component';
import { EquipementService } from '../../services/equipement.service';
import { DemandeService, DemandeMaintenance } from '../../services/demande.service';
import { PersonnelService } from '../../services/personnel.service';
import { Equipement } from '../../models/equipement.model';
import { Personnel } from '../../models/personnel.model';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);
declare const lucide: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MenuComponent, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit {

  menuMobileOuvert = signal(false);
  chargement = true;

  equipements: Equipement[] = [];
  demandes: DemandeMaintenance[] = [];
  personnels: Personnel[] = [];

  totalEquipements = 0;
  totalPannes = 0;

  equipementsDefaillants: { nom: string; nombre: number; pourcentage: number }[] = [];
  utilisateurs: { nom: string; score: number }[] = [];

  evolutionLabels: string[] = [];
  evolutionData: number[] = [];

  etatLabels: string[] = ['Fonctionnel', 'Maintenance', 'Panne'];
  etatData: number[] = [0, 0, 0];

  siteLabels: string[] = [];
  siteData: number[] = [];

  departementLabels: string[] = [];
  departementData: number[] = [];

  @ViewChild('chartEvolution') chartEvolution!: ElementRef;
  @ViewChild('chartEtat') chartEtat!: ElementRef;
  @ViewChild('chartSite') chartSite!: ElementRef;
  @ViewChild('chartDepartement') chartDepartement!: ElementRef;

  constructor(
    private equipementService: EquipementService,
    private demandeService: DemandeService,
    private personnelService: PersonnelService
  ) {}

  ngAfterViewInit(): void {
    forkJoin({
      equipements: this.equipementService.getAll(),
      demandes: this.demandeService.getAll(),
      personnels: this.personnelService.getAll()
    }).subscribe({
      next: ({ equipements, demandes, personnels }) => {
        this.equipements = equipements;
        this.demandes = demandes;
        this.personnels = personnels;

        this.calculerStats();
        this.initCharts();
        this.chargement = false;

        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
      },
      error: (err) => {
        console.error('Erreur chargement dashboard', err);
        this.chargement = false;
      }
    });
  }

  private calculerStats(): void {
    this.totalEquipements = this.equipements.length;

    this.totalPannes = this.demandes.filter(
      d => d.status !== 'RESOLUE' && d.status !== 'REFUSEE'
    ).length;

    // --- Équipements les plus défaillants ---
    const compteParEquipement = new Map<string, number>();
    for (const d of this.demandes) {
      const matricule = d.matriculeEquipement ?? 'Inconnu';
      compteParEquipement.set(matricule, (compteParEquipement.get(matricule) ?? 0) + 1);
    }
    const trie = Array.from(compteParEquipement.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    const maxPannes = trie.length > 0 ? trie[0][1] : 1;
    this.equipementsDefaillants = trie.map(([nom, nombre]) => ({
      nom,
      nombre,
      pourcentage: Math.round((nombre / maxPannes) * 100)
    }));

    // --- État du parc ---
    this.etatData = [
      this.equipements.filter((e: any) => e.etatEquipement === 'FONCTIONNEL').length,
      this.equipements.filter((e: any) => e.etatEquipement === 'MAINTENANCE').length,
      this.equipements.filter((e: any) => e.etatEquipement === 'PANNE').length
    ];

    // --- Pannes par site (site du TECHNICIEN affecté) ---
    const siteParTechnicienId = new Map<number, string>(
      this.personnels
        .filter(p => p.site)
        .map(p => [p.id, p.site as string])
    );

    const compteParSite = new Map<string, number>();
    for (const d of this.demandes) {
      if (!d.idTechnicien) continue;
      const site = siteParTechnicienId.get(d.idTechnicien) ?? 'Non affecté';
      compteParSite.set(site, (compteParSite.get(site) ?? 0) + 1);
    }
    this.siteLabels = Array.from(compteParSite.keys());
    this.siteData = Array.from(compteParSite.values());

    // --- Pannes par département (département du TECHNICIEN affecté) ---
    const departementParTechnicienId = new Map<number, string>(
      this.personnels
        .filter(p => p.departement)
        .map(p => [p.id, p.departement as string])
    );

    const compteParDepartement = new Map<string, number>();
    for (const d of this.demandes) {
      if (!d.idTechnicien) continue;
      const dep = departementParTechnicienId.get(d.idTechnicien) ?? 'Non affecté';
      compteParDepartement.set(dep, (compteParDepartement.get(dep) ?? 0) + 1);
    }
    this.departementLabels = Array.from(compteParDepartement.keys());
    this.departementData = Array.from(compteParDepartement.values());

    // --- Évolution des pannes par mois (triée chronologiquement) ---
    const compteParMoisCle = new Map<string, number>(); // cle = "2024-01"
    for (const d of this.demandes) {
      if (!d.dateDemande) continue;
      const date = new Date(d.dateDemande);
      const cle = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      compteParMoisCle.set(cle, (compteParMoisCle.get(cle) ?? 0) + 1);
    }

    const clesTriees = Array.from(compteParMoisCle.keys()).sort(); // tri chronologique YYYY-MM
    this.evolutionLabels = clesTriees.map(cle => {
      const [annee, mois] = cle.split('-');
      const date = new Date(Number(annee), Number(mois) - 1);
      return date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
    });
    this.evolutionData = clesTriees.map(cle => compteParMoisCle.get(cle)!);

    // --- Top intervenants ---
    const scoreParTechnicien = new Map<string, number>();
    for (const d of this.demandes) {
      if (d.nomTechnicien) {
        scoreParTechnicien.set(
          d.nomTechnicien,
          (scoreParTechnicien.get(d.nomTechnicien) ?? 0) + 1
        );
      }
    }
    this.utilisateurs = Array.from(scoreParTechnicien.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([nom, score]) => ({ nom, score }));
  }

  private initCharts(): void {
    if (!this.chartEvolution || !this.chartEtat || !this.chartSite || !this.chartDepartement) return;

    new Chart(this.chartEvolution.nativeElement, {
      type: 'line',
      data: {
        labels: this.evolutionLabels,
        datasets: [{
          label: 'Pannes',
          data: this.evolutionData,
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true
      }
    });

    new Chart(this.chartEtat.nativeElement, {
      type: 'doughnut',
      data: {
        labels: this.etatLabels,
        datasets: [{ data: this.etatData }]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true
      }
    });

    new Chart(this.chartSite.nativeElement, {
      type: 'bar',
      data: {
        labels: this.siteLabels,
        datasets: [{ label: 'Pannes', data: this.siteData }]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true
      }
    });

    new Chart(this.chartDepartement.nativeElement, {
      type: 'bar',
      data: {
        labels: this.departementLabels,
        datasets: [{ label: 'Pannes', data: this.departementData }]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true
      }
    });
  }

  toggleMenuMobile() {
    this.menuMobileOuvert.update(value => !value);
  }

  fermerMenuMobile() {
    this.menuMobileOuvert.set(false);
  }
}