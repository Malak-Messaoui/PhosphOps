import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Equipement, EtatEquipement } from '../../models/equipement.model';
import { EquipementService } from '../../services/equipement.service';
import { MenuComponent } from '../menu/menu.component';
import { HeaderComponent } from '../header/header.component';

declare const lucide: any;

@Component({
  selector: 'app-equipements',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MenuComponent,
    HeaderComponent
  ],
  templateUrl: './equipement.component.html',
  styleUrls: ['./equipement.component.css']
})
export class EquipementComponent implements OnInit, AfterViewInit {

  menuMobileOuvert = signal(false);

  equipements: Equipement[] = [];
  filteredEquipements: Equipement[] = [];

  searchTerm = '';

  isModalOpen = false;
  isEditMode = false;
  isViewMode = false;

  selectedEquipementId?: number;
  selectedEquipement?: Equipement;

  equipementForm: FormGroup;

  etats = Object.values(EtatEquipement);

  categories = [
    'Concassage',
    'Hydraulique',
    'Transport',
    'Traitement',
    'Pneumatique',
    'Filtration'
  ];


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


  ngOnInit(): void {
    this.loadEquipements();
  }


  // Une seule fois après le premier rendu — évite la boucle infinie
  // de requestAnimationFrame causée par ngAfterViewChecked
  ngAfterViewInit(): void {

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

  }



  loadEquipements(): void {

    this.equipementService.getAll()
      .subscribe({

        next: (data) => {

          this.equipements = data;
          this.filteredEquipements = data;

          // Ré-invoque lucide après le chargement (nouvelles icônes via *ngFor)
          if (typeof lucide !== 'undefined') {
            setTimeout(() => lucide.createIcons(), 0);
          }

        },


        error: (err) =>
          console.error(
            'Erreur chargement équipements',
            err
          )

      });

  }




  onSearch(): void {

    const term = this.searchTerm
      .trim()
      .toLowerCase();


    this.filteredEquipements =
      this.equipements.filter(eq =>

        eq.matriculeEquipement
          .toLowerCase()
          .includes(term)

        ||

        eq.categorieEquipement
          .toLowerCase()
          .includes(term)

      );

  }





  consulter(equipement: Equipement): void {

    this.selectedEquipement = equipement;

    this.isViewMode = true;

  }



  closeViewModal(): void {

    this.isViewMode = false;

    this.selectedEquipement = undefined;

  }





  openAddModal(): void {

    this.isEditMode = false;

    this.selectedEquipementId = undefined;


    this.equipementForm.reset({

      etatEquipement:
      EtatEquipement.FONCTIONNEL

    });


    this.isModalOpen = true;

  }





  openEditModal(equipement: Equipement): void {


    this.isEditMode = true;


    this.selectedEquipementId =
      equipement.idEquipement;



    this.equipementForm.patchValue({

      matriculeEquipement:
        equipement.matriculeEquipement,


      dateAchatEquipement:
        equipement.dateAchatEquipement
        .substring(0,10),


      categorieEquipement:
        equipement.categorieEquipement,


      etatEquipement:
        equipement.etatEquipement

    });



    this.isModalOpen = true;

  }





  closeModal(): void {

    this.isModalOpen = false;

  }






  onSubmit(): void {


    if(this.equipementForm.invalid){

      this.equipementForm.markAllAsTouched();

      return;

    }



    const formValue: Equipement = {

      ...this.equipementForm.value,


      dateAchatEquipement:
      this.equipementForm.value
      .dateAchatEquipement + "T00:00:00"

    };




    if(
      this.isEditMode &&
      this.selectedEquipementId
    ){


      this.equipementService
      .update(
        this.selectedEquipementId,
        formValue
      )
      .subscribe({

        next:()=>{

          this.loadEquipements();

          this.closeModal();

        },


        error:(err)=>
        console.error(
          'Erreur modification',
          err
        )

      });



    }
    else {


      this.equipementService
      .create(formValue)
      .subscribe({

        next:()=>{

          this.loadEquipements();

          this.closeModal();

        },


        error:(err)=>
        console.error(
          'Erreur création',
          err
        )

      });


    }


  }






  onDelete(id?: number): void {


    if(!id) return;


    if(
      !confirm(
        'Voulez-vous vraiment supprimer cet équipement ?'
      )
    ) return;



    this.equipementService
    .delete(id)
    .subscribe({

      next:()=>this.loadEquipements(),


      error:(err)=>
      console.error(
        'Erreur suppression',
        err
      )

    });


  }






  badgeClass(etat: EtatEquipement): string {


    switch(etat){


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






  toggleMenuMobile(): void {

    this.menuMobileOuvert.update(
      v => !v
    );

  }




  fermerMenuMobile(): void {

    this.menuMobileOuvert.set(false);

  }



}