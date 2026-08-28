import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatResponse {
  reponse: string;
}

export interface DiagnosticResponse {
  causesProbables: string[];
  piecesAVerifier: string[];
  conseilGeneral: string;
}

@Injectable({ providedIn: 'root' })
export class AiService {
  private baseUrl = 'https://phosphopsbackend-bac3czavgtbea6aw.swedencentral-01.azurewebsites.net/PhosphOps/ai';

  constructor(private http: HttpClient) {}

  chat(message: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(`${this.baseUrl}/chat`, { message });
  }

  diagnostic(description: string, photoUrl?: string): Observable<DiagnosticResponse> {
    return this.http.post<DiagnosticResponse>(`${this.baseUrl}/diagnostic`, {
      description,
      photoUrl
    });
  }
}