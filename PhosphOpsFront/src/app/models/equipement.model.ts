export interface Equipement {
  idEquipement?: number;
  matriculeEquipement: string;
  dateAchatEquipement: string; // format ISO, ex: '2024-05-30T00:00:00'
  categorieEquipement: string;
  etatEquipement: EtatEquipement;
}

export enum EtatEquipement {
  FONCTIONNEL = 'FONCTIONNEL',
  MAINTENANCE = 'MAINTENANCE',
  PANNE = 'PANNE'
}