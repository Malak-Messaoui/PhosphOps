import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';

import {
  Equipement,
  EtatEquipement
} from '../../models/equipement.model';

import { EquipementService } from '../../services/equipement.service';

import { MenuComponent } from '../menu/menu.component';
import { HeaderComponent } from '../header/header.component';

import {
  LucideAngularModule,
  Plus,
  Eye,
  Pencil,
  Trash2,
  X
} from 'lucide-angular';


@Component({
  selector: 'app-equipements',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,

    MenuComponent,
    HeaderComponent,

  ],

  templateUrl: './equipement.component.html',
  styleUrls: ['./equipement.component.css']
})
export class EquipementComponent implements OnInit {

  /* =========================
     MENU MOBILE
  ========================= */

  menuMobileOuvert = signal(false);


  /* =========================
     ÉQUIPEMENTS
  ========================= */

  equipements: Equipement[] = [];

  filteredEquipements: Equipement[] = [];

  searchTerm = '';


  /* =========================
     MODALS
  ========================= */

  isModalOpen = false;

  isEditMode = false;

  isViewMode = false;


  selectedEquipementId?: number;

  selectedEquipement?: Equipement;


  /* =========================
     FORMULAIRE
  ========================= */

  equipementForm: FormGroup;


  /* =========================
     LISTES
  ========================= */

  etats = Object.values(EtatEquipement);

  categories = [
    'Concassage',
    'Hydraulique',
    'Transport',
    'Traitement',
    'Pneumatique',
    'Filtration'
  ];


  /* =========================
     CONSTRUCTOR
  ========================= */

  constructor(
    private equipementService: EquipementService,
    private fb: FormBuilder
  ) {

    this.equipementForm = this.fb.group({

      matriculeEquipement: [
        '',
        Validators.required
      ],

      dateAchatEquipement: [
        '',
        Validators.required
      ],

      categorieEquipement: [
        '',
        Validators.required
      ],

      etatEquipement: [
        EtatEquipement.FONCTIONNEL,
        Validators.required
      ]

    });

  }


  /* =========================
     INIT
  ========================= */

  ngOnInit(): void {

    this.loadEquipements();

  }


  /* =========================
     CHARGER LES ÉQUIPEMENTS
  ========================= */

  loadEquipements(): void {

    this.equipementService.getAll()
      .subscribe({

        next: (data: Equipement[]) => {

          console.log(
            'ÉQUIPEMENTS ADMIN :',
            data
          );

          console.log(
            'NOMBRE ÉQUIPEMENTS :',
            data?.length ?? 0
          );


          this.equipements = data ?? [];

          this.filteredEquipements =
            [...this.equipements];

        },


        error: (err) => {

          console.error(
            'Erreur chargement équipements :',
            err
          );

          this.equipements = [];

          this.filteredEquipements = [];

        }

      });

  }


  /* =========================
     RECHERCHE
  ========================= */

  onSearch(): void {

    const term =
      this.searchTerm
        .trim()
        .toLowerCase();


    if (!term) {

      this.filteredEquipements =
        [...this.equipements];

      return;

    }


    this.filteredEquipements =
      this.equipements.filter(
        (eq: Equipement) => {

          const matricule =
            eq.matriculeEquipement
              ?.toLowerCase() ?? '';

          const categorie =
            eq.categorieEquipement
              ?.toLowerCase() ?? '';


          return (
            matricule.includes(term) ||
            categorie.includes(term)
          );

        }
      );

  }


  /* =========================
     CONSULTER
  ========================= */

  consulter(equipement: Equipement): void {

    this.selectedEquipement = equipement;

    this.isViewMode = true;

  }


  /* =========================
     FERMER MODAL CONSULTATION
  ========================= */

  closeViewModal(): void {

    this.isViewMode = false;

    this.selectedEquipement = undefined;

  }


  /* =========================
     AJOUTER
  ========================= */

  openAddModal(): void {

    this.isEditMode = false;

    this.selectedEquipementId = undefined;


    this.equipementForm.reset({

      matriculeEquipement: '',

      dateAchatEquipement: '',

      categorieEquipement: '',

      etatEquipement:
        EtatEquipement.FONCTIONNEL

    });


    this.isModalOpen = true;

  }


  /* =========================
     MODIFIER
  ========================= */

  openEditModal(
    equipement: Equipement
  ): void {

    this.isEditMode = true;


    this.selectedEquipementId =
      equipement.idEquipement;


    let dateAchat = '';

    if (equipement.dateAchatEquipement) {

      dateAchat =
        equipement.dateAchatEquipement
          .substring(0, 10);

    }


    this.equipementForm.patchValue({

      matriculeEquipement:
        equipement.matriculeEquipement,

      dateAchatEquipement:
        dateAchat,

      categorieEquipement:
        equipement.categorieEquipement,

      etatEquipement:
        equipement.etatEquipement

    });


    this.isModalOpen = true;

  }


  /* =========================
     FERMER MODAL AJOUT/MODIFICATION
  ========================= */

  closeModal(): void {

    this.isModalOpen = false;

    this.equipementForm.reset({

      matriculeEquipement: '',

      dateAchatEquipement: '',

      categorieEquipement: '',

      etatEquipement:
        EtatEquipement.FONCTIONNEL

    });

  }


  /* =========================
     SUBMIT
  ========================= */

  onSubmit(): void {

    if (this.equipementForm.invalid) {

      this.equipementForm.markAllAsTouched();

      return;

    }


    const formValue =
      this.equipementForm.value;


    const equipement: Equipement = {

      ...formValue,

      dateAchatEquipement:
        formValue.dateAchatEquipement
          ? formValue.dateAchatEquipement
            + 'T00:00:00'
          : null

    };


    /* =========================
       MODIFICATION
    ========================= */

    if (
      this.isEditMode &&
      this.selectedEquipementId !== undefined
    ) {

      this.equipementService
        .update(
          this.selectedEquipementId,
          equipement
        )
        .subscribe({

          next: () => {

            console.log(
              'Équipement modifié'
            );

            this.loadEquipements();

            this.closeModal();

          },


          error: (err) => {

            console.error(
              'Erreur modification équipement :',
              err
            );

          }

        });

      return;

    }


    /* =========================
       CRÉATION
    ========================= */

    this.equipementService
      .create(equipement)
      .subscribe({

        next: () => {

          console.log(
            'Équipement créé'
          );

          this.loadEquipements();

          this.closeModal();

        },


        error: (err) => {

          console.error(
            'Erreur création équipement :',
            err
          );

        }

      });

  }


  /* =========================
     SUPPRIMER
  ========================= */

  onDelete(id?: number): void {

    if (id === undefined) {

      return;

    }


    const confirmation =
      confirm(
        'Voulez-vous vraiment supprimer cet équipement ?'
      );


    if (!confirmation) {

      return;

    }


    this.equipementService
      .delete(id)
      .subscribe({

        next: () => {

          console.log(
            'Équipement supprimé'
          );

          this.loadEquipements();

        },


        error: (err) => {

          console.error(
            'Erreur suppression équipement :',
            err
          );

        }

      });

  }


  /* =========================
     BADGE ÉTAT
  ========================= */

  badgeClass(
    etat: EtatEquipement
  ): string {

    switch (etat) {

      case EtatEquipement.FONCTIONNEL:

        return 'badge-status-fonctionnel';


      case EtatEquipement.MAINTENANCE:

        return 'badge-status-maintenance';


      case EtatEquipement.PANNE:

        return 'badge-status-panne';


      default:

        return '';

    }

  }


  /* =========================
     VALIDATION HELPERS
  ========================= */

  matriculeInvalid(): boolean {

    const c =
      this.equipementForm.get('matriculeEquipement');

    return !!(c?.invalid && c?.touched);

  }


  dateInvalid(): boolean {

    const c =
      this.equipementForm.get('dateAchatEquipement');

    return !!(c?.invalid && c?.touched);

  }


  /* =========================
     MENU MOBILE
  ========================= */

  toggleMenuMobile(): void {

    this.menuMobileOuvert.update(
      value => !value
    );

  }


  fermerMenuMobile(): void {

    this.menuMobileOuvert.set(false);

  }

}