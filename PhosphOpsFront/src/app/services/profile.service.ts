import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private apiUrl = `${environment.apiUrl}/api/users`;

  constructor(
    private http: HttpClient
  ) {}

  getProfile(id: number): Observable<User> {
    return this.http.get<User>(
      `${this.apiUrl}/${id}`
    );
  }

  updateProfile(id: number, user: any) {
    return this.http.put<User>(
      `${this.apiUrl}/${id}`,
      user
    );
  }

  changePassword(id: number, payload: { oldPassword: string; newPassword: string }) {
    return this.http.put<{ message: string }>(
      `${this.apiUrl}/${id}/password`,
      payload
    );
  }
}