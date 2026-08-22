import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginResponse } from '../models/login-response.model';


export interface LoginRequest {
  email:string;
  password:string;
}


@Injectable({
  providedIn:'root'
})
export class AuthService {


  private readonly authUrl =
  'http://localhost:8087/PhosphOps/auth/login';


  private readonly tokenKey =
  'phosphops_token';


  private readonly userKey =
  'phosphops_user';



  isLoggedIn =
  signal(this.hasToken());



  constructor(
    private http:HttpClient,
    private router:Router
  ){}




  login(
    payload:LoginRequest
  ):Observable<LoginResponse>{


    return this.http
    .post<LoginResponse>(
      this.authUrl,
      payload
    )

    .pipe(

      tap((res)=>{


        console.log(
          "LOGIN RESPONSE :",
          res
        );



        localStorage.setItem(
          this.tokenKey,
          res.token
        );



        localStorage.setItem(
          this.userKey,
          JSON.stringify({

            id:res.id,

            email:res.email,

            name:res.name ?? res.email.split('@')[0],

            role:res.role

          })
        );



        this.isLoggedIn.set(true);



      })


    );


  }






  getCurrentUser(){


    const user =
    localStorage.getItem(
      this.userKey
    );


    return user
    ? JSON.parse(user)
    : null;


  }





  getToken(){

    return localStorage.getItem(
      this.tokenKey
    );

  }




logout(){
  const user = this.getCurrentUser();
  const isAdmin = user?.role === 'ADMIN';

  localStorage.removeItem(this.tokenKey);
  localStorage.removeItem(this.userKey);

  this.isLoggedIn.set(false);

  this.router.navigate([isAdmin ? '/admin-login' : '/login']);
}





  private hasToken(){

    return !!localStorage.getItem(
      this.tokenKey
    );

  }

register(payload: {
  nom: string;
  matricule: string;
  email: string;
  telephone: string;
  site: string;
  departement: string;
  password: string;
}): Observable<LoginResponse> {

  return this.http
    .post<LoginResponse>(
      'http://localhost:8087/PhosphOps/auth/register',
      payload
    )
    .pipe(
      tap((res) => {

        localStorage.setItem(this.tokenKey, res.token);

        localStorage.setItem(
          this.userKey,
          JSON.stringify({
            id: res.id,
            email: res.email,
            name: res.name ?? res.email.split('@')[0],
            role: res.role
          })
        );

        this.isLoggedIn.set(true);
      })
    );
}

loginWithGoogle() {
  window.location.href = 'http://localhost:8087/PhosphOps/oauth2/authorization/google';
}

storeSession(token: string, id: number, email: string, name: string, role: string) {
  localStorage.setItem(this.tokenKey, token);
  localStorage.setItem(this.userKey, JSON.stringify({ id, email, name, role }));
  this.isLoggedIn.set(true);
}

forgotPassword(payload: { email: string; newPassword: string }): Observable<any> {
  return this.http.post<any>(
    'http://localhost:8087/PhosphOps/auth/forgot-password',
    payload
  );
}

completeOAuthRegistration(payload: {
  email: string;
  nom: string;
  matricule: string;
  telephone: string;
  site: string;
  departement: string;
}): Observable<LoginResponse> {
  return this.http
    .post<LoginResponse>('http://localhost:8087/PhosphOps/auth/oauth2-complete', payload)
    .pipe(
      tap((res) => {
        this.storeSession(res.token, res.id, res.email, res.name ?? res.email.split('@')[0], res.role);
      })
    );
}



}