import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PanneRequest {
  typePanne: string;
  descPanne: string;
  priorite: string;
  matriculeEquipement: string;
}

export interface PanneResponse {
  idPanne: number;
  typePanne: string;
  descPanne: string;
  priorite: string;
  datePanne: string;
  matriculeEquipement: string;
  photoUrl: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class PanneService {

  private readonly apiUrl = `${environment.apiUrl}/api/pannes`;

  constructor(private http: HttpClient) {}

  declarer(panne: PanneRequest, photo: File | null): Observable<PanneResponse> {
    const formData = new FormData();

    const panneBlob = new Blob([JSON.stringify(panne)], { type: 'application/json' });
    formData.append('panne', panneBlob);

    if (photo) {
      formData.append('photo', photo);
    }

    return this.http.post<PanneResponse>(this.apiUrl, formData);
  }
}