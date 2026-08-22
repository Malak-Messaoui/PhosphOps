import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface DemandeMaintenance {
  idDemande: number;
  idPanne: number;
  matriculeEquipement: string;
  typePanne: string;
  descPanne: string;
  priorite: string;
  photoUrl: string | null;
  idTechnicien: number | null;
  nomTechnicien: string | null;
  status: string;
  dateDemande: string;
  commentaireAdmin: string | null;
}

export interface Technicien {
  id: number;
  fullName: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class DemandeService {

  private readonly apiUrl = 'http://localhost:8087/PhosphOps/api/demandes';
  private readonly usersUrl = 'http://localhost:8087/PhosphOps/api/users';

  constructor(private http: HttpClient) {}

  getAll(statut?: string): Observable<DemandeMaintenance[]> {
    let params = new HttpParams();
    if (statut) {
      params = params.set('statut', statut);
    }
    return this.http.get<DemandeMaintenance[]>(this.apiUrl, { params });
  }

  accepter(id: number): Observable<DemandeMaintenance> {
    return this.http.put<DemandeMaintenance>(`${this.apiUrl}/${id}/accepter`, {});
  }

  refuser(id: number, commentaire?: string): Observable<DemandeMaintenance> {
    return this.http.put<DemandeMaintenance>(`${this.apiUrl}/${id}/refuser`, { commentaire });
  }

  affecter(id: number, idTechnicien: number): Observable<DemandeMaintenance> {
    return this.http.put<DemandeMaintenance>(`${this.apiUrl}/${id}/affecter`, { idTechnicien });
  }

  getTechniciens(): Observable<Technicien[]> {
    return this.http.get<Technicien[]>(`${this.usersUrl}/techniciens`);
  }
}