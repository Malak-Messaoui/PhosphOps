import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';



@Component({

 selector:'app-header',

 standalone:true,

 imports:[
  CommonModule
 ],

 templateUrl:'./header.component.html',

 styleUrl:'./header.component.css'

})


export class HeaderComponent implements OnInit {


 menuMobileOuvert=false;


 afficherRecherche=false;


 user:any=null;




 constructor(

  private router:Router,

  private authService:AuthService

 ){


  this.router.events

  .pipe(
    filter(
      event=>event instanceof NavigationEnd
    )
  )

  .subscribe(()=>{


    const url=this.router.url;



    this.afficherRecherche =

    url.includes('/utilisateurs')

    ||

    url.includes('/equipements');



  });



 }




 ngOnInit(){


  this.user =
  this.authService.getCurrentUser();



  console.log(
    "USER HEADER :",
    this.user
  );



 }





 toggleMenuMobile(){

  this.menuMobileOuvert =
  !this.menuMobileOuvert;

 }




 getInitiale(){


  if(!this.user?.name){

    return '';

  }



  return this.user.name
  .charAt(0)
  .toUpperCase();


 }



}