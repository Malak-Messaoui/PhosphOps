import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InterventionListItem, InterventionDetail, Piece } from '../models/intervention.model';

@Injectable({ providedIn: 'root' })
export class InterventionService {
  private baseUrl = 'http://localhost:8087/PhosphOps';

  constructor(private http: HttpClient) {}

  getMesInterventions(): Observable<InterventionListItem[]> {
    return this.http.get<InterventionListItem[]>(`${this.baseUrl}/interventions/mes-interventions`);
  }

  getDetail(id: number): Observable<InterventionDetail> {
    return this.http.get<InterventionDetail>(`${this.baseUrl}/interventions/${id}`);
  }

  demarrer(id: number): Observable<InterventionDetail> {
    return this.http.post<InterventionDetail>(`${this.baseUrl}/interventions/${id}/demarrer`, {});
  }

  cloturer(id: number, compteRendu: string, pieces: { idPiece: number; quantite: number }[]): Observable<InterventionDetail> {
    return this.http.post<InterventionDetail>(`${this.baseUrl}/interventions/${id}/cloturer`, { compteRendu, pieces });
  }

  rechercherPieces(q: string): Observable<Piece[]> {
    return this.http.get<Piece[]>(`${this.baseUrl}/pieces/search`, { params: { q } });
  }
}