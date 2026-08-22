export enum RolePersonnel {
  TECHNICIEN = 'TECHNICIEN',
  RESPONSABLE_MAINTENANCE = 'RESPONSABLE_MAINTENANCE',
  CHEF_DEPARTEMENT = 'CHEF_DEPARTEMENT'
}

export interface Personnel {
  id: number;
  nom: string;
  email: string;
  matricule: string;
  role: RolePersonnel;
  site?: string;         // <-- AJOUTÉ
  departement?: string;  // <-- AJOUTÉ
}

export interface PersonnelCreate {
  nom: string;
  email: string;
  matricule: string;
  role: RolePersonnel;
}

export interface PersonnelUpdate {
  nom?: string;
  email?: string;
  matricule?: string;
  role?: RolePersonnel;
}

export function initiales(nom: string): string {
  return nom
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(mot => mot.charAt(0).toUpperCase())
    .join('');
}