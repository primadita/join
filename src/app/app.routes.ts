import { Routes } from '@angular/router';
import { MainShellComponent } from './main-content/main-shell.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LegalAndPrivacyComponent } from './auth/legal-and-privacy/legal-and-privacy.component';
import { authGuard } from './auth-functional.guard';

export const routes: Routes = [
  // wenn im browser nur / verwendet wird, leitet dies direkt auf /login um
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  // aufruf von /login rendert die Login-Seite
  { path: 'login', component: LoginComponent },

  // aufruf von /legalAndPrivacy rendert den Inhalt, für die policy oder legal
  { path: 'legalAndPrivacy', component: LegalAndPrivacyComponent },

  { path: 'register', component: SignupComponent },
  // aufruf von /main rendert den Wrapper, der <app-main-content anzeigt
  { path: 'main', component: MainShellComponent, canActivate: [authGuard] },
  // jeder unbekannte pfad wird auf /login umgeleitet
  { path: '**', redirectTo: 'login' },
];
