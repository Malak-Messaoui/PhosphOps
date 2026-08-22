export interface Piece {
  idPiece: number;
  nom: string;
  reference: string;
}

export interface PieceUtilisee {
  idPiece: number;
  nom: string;
  reference: string;
  quantite: number;
}

export interface InterventionListItem {
  idIntervention: number;
  status: 'PLANIFIEE' | 'EN_COURS' | 'TERMINEE';
  priorite: 'URGENT' | 'NORMAL' | 'FAIBLE';
  nomEquipement: string;
  matriculeEquipement: string;
  datePanne: string;
}

export interface InterventionDetail extends InterventionListItem {
  dateDebut: string | null;
  dateFin: string | null;
  compteRendu: string | null;
  piecesUtilisees: PieceUtilisee[];
}