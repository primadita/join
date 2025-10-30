import { Routes } from '@angular/router';
import { MainContentComponent } from './main-content/main-content.component';
import { MainShellComponent } from './main-content/main-shell.component';
import { HelpComponent } from './shared/components/help/help.component';
import { PrivacyPolicyComponent } from './shared/components/privacy-policy/privacy-policy.component';
import { LegalNoticeComponent } from './shared/components/legal-notice/legal-notice.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: SignupComponent},
  { path: 'main', component: MainShellComponent },
  { path: '**', redirectTo: 'login' },
];
