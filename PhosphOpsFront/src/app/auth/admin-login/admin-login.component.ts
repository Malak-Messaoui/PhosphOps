import { Component } from '@angular/core';
import {
 FormBuilder,
 FormGroup,
 Validators,
 ReactiveFormsModule
} from '@angular/forms';

import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';



@Component({

 selector:'app-admin-login',

 standalone:true,

 imports:[
  CommonModule,
  ReactiveFormsModule
 ],

 templateUrl:'./admin-login.component.html',

 styleUrl:'./admin-login.component.css'

})


export class AdminLoginComponent {


 form:FormGroup;

 erreur='';

 envoiEnCours=false;



 constructor(

  private fb:FormBuilder,

  private authService:AuthService,

  private router:Router

 ){


  this.form=this.fb.group({

    email:[
      '',
      [
       Validators.required,
       Validators.email
      ]
    ],


    password:[
      '',
      Validators.required
    ]

  });


 }





 soumettre(){


  if(this.form.invalid){

    this.form.markAllAsTouched();

    return;

  }



  this.envoiEnCours=true;

  this.erreur='';




  this.authService
  .login(this.form.value)

  .subscribe({



    next:(response)=>{


      console.log(
        "Connexion réussie",
        response
      );



      this.envoiEnCours=false;



      this.router
      .navigateByUrl('/home');



    },




    error:(err)=>{


      console.error(
        "Erreur login",
        err
      );


      this.envoiEnCours=false;


      this.erreur=
      "Email ou mot de passe incorrect";


    }



  });



 }



}