import { Routes } from '@angular/router';
import { MainContentComponent } from './main-content/main-content.component';
import { MainShellComponent } from './main-content/main-shell.component';
import { HelpComponent } from './shared/components/help/help.component';
import { PrivacyPolicyComponent } from './shared/components/privacy-policy/privacy-policy.component';
import { LegalNoticeComponent } from './shared/components/legal-notice/legal-notice.component';
import { LoginComponent } from './auth/login/login.component';

export const routes: Routes = [
  // wenn im browser nur / verwendet wird, leitet dies direkt auf /login um
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  // aufruf von /login rendert die Login-Seite
  { path: 'login', component: LoginComponent },
  // aufruf von /main rendert den Wrapper, der <app-main-content anzeigt
  { path: 'main', component: MainShellComponent },
  // jeder unbekannte pfad wird auf /login umgeleitet
  { path: '**', redirectTo: 'login' },
];
