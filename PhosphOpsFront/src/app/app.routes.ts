import { Routes } from '@angular/router';
import { PersonnelComponent } from './backoffice/personnel/personnel.component';
import { AdminLoginComponent } from './auth/admin-login/admin-login.component';
import { HomeComponent } from './backoffice/home/home.component';
import { EquipementComponent } from './backoffice/equipement/equipement.component';
import { ProfileComponent } from './backoffice/profile/profile.component';
import { ProfileComponent as ProfilClientComponent } from './frontoffice/profil-client/profil-client.component';
import { RegisterComponent } from './frontoffice/register/register.component';
import { LoginComponent } from './frontoffice/login/login.component';
import { AcceuilComponent } from './frontoffice/acceuil/acceuil.component';
import { PanneComponent } from './frontoffice/panne/panne.component';
import { DemandeComponent } from './backoffice/demande/demande.component';
import { ListEquipementComponent } from './frontoffice/list-equipement/list-equipement.component';
import { Oauth2SelectRoleComponent } from './frontoffice/oauth2-select-role/oauth2-select-role.component';
import { Oauth2CallbackComponent } from './frontoffice/oauth2-callback/oauth2-callback.component';
import { InterventionComponent } from './frontoffice/intervention/intervention.component';


export const routes: Routes = [
  { path: '', redirectTo: 'admin-login', pathMatch: 'full' },
  { path: 'admin-login', component: AdminLoginComponent },
  { path: 'utilisateurs', component: PersonnelComponent },
  { path: 'home', component: HomeComponent },
  { path: 'equipements', component: EquipementComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'profil-client', component: ProfilClientComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'acceuil', component: AcceuilComponent },
  { path: 'login', component: LoginComponent },
  { path: 'panne', component: PanneComponent },
  { path: 'demandes', component: DemandeComponent },
{ path: 'list-equipements', component: ListEquipementComponent },
  { path: 'oauth2/callback', component: Oauth2CallbackComponent },        
  { path: 'oauth2/select-role', component: Oauth2SelectRoleComponent }, 
    { path: 'intervention', component: InterventionComponent },
    {
  path: 'diagnostic',
  loadComponent: () =>
    import('./frontoffice/diagnostic/diagnostic.component').then(m => m.DiagnosticComponent)
}

]

