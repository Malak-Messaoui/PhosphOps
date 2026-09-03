import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Personnel, PersonnelCreate, PersonnelUpdate } from '../models/personnel.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PersonnelService {
  private readonly baseUrl = `${environment.apiUrl}/api/personnels`;

  constructor(private http: HttpClient) {}

  private mapFromBackend = (dto: any): Personnel => ({
    id: dto.idPersonnel,
    nom: dto.fullName,
    email: dto.email,
    matricule: dto.matricule,
    role: dto.poste,
    site: dto.site,
    departement: dto.departement,
  });

  private mapToBackend = (payload: Partial<PersonnelCreate>): any => {
    const dto: any = {};
    if (payload.nom !== undefined) dto.fullName = payload.nom;
    if (payload.email !== undefined) dto.email = payload.email;
    if (payload.matricule !== undefined) dto.matricule = payload.matricule;
    if (payload.role !== undefined) dto.poste = payload.role;
    return dto;
  };

  getAll(): Observable<Personnel[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      map((list) => list.map(this.mapFromBackend))
    );
  }

  getById(id: number): Observable<Personnel> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(this.mapFromBackend)
    );
  }

  create(payload: PersonnelCreate): Observable<Personnel> {
    return this.http.post<any>(this.baseUrl, this.mapToBackend(payload)).pipe(
      map(this.mapFromBackend)
    );
  }

  update(id: number, payload: PersonnelUpdate): Observable<Personnel> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, this.mapToBackend(payload)).pipe(
      map(this.mapFromBackend)
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}