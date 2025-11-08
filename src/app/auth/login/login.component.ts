import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { FormsModule } from '@angular/forms';
import { A11yModule } from '@angular/cdk/a11y';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, A11yModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  authError: string | null = null;
  isSubmitting = false;
  hidePassword: boolean = true;
  showLogin: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  // #region______________ AUTH-HANDLING & ROUTING ______________
  login() {
    this.authError = null;
    this.isSubmitting = true;
    this.authService
      .login(this.email, this.password)
      .then((userCredential) => {
        console.log('Login erfolgreich: ', userCredential.user.email);
        // this.authService.currentUser = userCredential.user;
        this.goToApp();
        this.isSubmitting = false;

        try {
          sessionStorage.removeItem('loginPW');
        } catch {}
      })
      .catch((error) => {
        console.error('Login fehlgeschlagen: ', error.message);
        this.authError = 'Check your email and password. Please try again.';
        this.isSubmitting = false;
      });
  }

  loginGuest() {
    const mail = 'gast@email.de';
    const pw = '0123456';
    this.authError = null;
    this.isSubmitting = true;
    this.authService
      .login(mail, pw)
      .then((userCredential) => {
        console.log('Login erfolgreich: ', userCredential.user.email);
        // this.authService.currentUser = userCredential.user;
        this.goToApp();
        this.isSubmitting = false;
      })
      .catch((error) => {
        console.error('Login fehlgeschlagen: ', error.message);
        this.authError = 'Check your email and password. Please try again.';
        this.isSubmitting = false;
      });
  }

  goToApp() {
    this.router.navigateByUrl('/main');
  }

  goToLegalAndPrivacy() {
    this.router.navigateByUrl('/legalAndPrivacy');
  }
  // #endregion______________ AUTH-HANDLING & ROUTING ______________

  //#region______________ SESSION-STORAGE ______________
  ngOnInit() {
    this.loadInputFromSessionStorage();
  }

  loadInputFromSessionStorage() {
    const savedEmail = sessionStorage.getItem('loginEmail');
    if (savedEmail) {
      this.email = JSON.parse(savedEmail);
    }
    const savedPw = sessionStorage.getItem('loginPW');
    if (savedPw) {
      this.password = JSON.parse(savedPw);
    }
  }

  onEmailChange(value: string) {
    this.email = value;
    sessionStorage.setItem('loginEmail', JSON.stringify(this.email));
  }

  onPasswordChange(value: string) {
    this.password = value;
    sessionStorage.setItem('loginPW', JSON.stringify(this.password));
  }
  //#endregion______________ SESSION-STORAGE ______________

  //______________ ERROR-HANDLING ______________
  clearAuthError() {
    if (this.authError) this.authError = null;
  }

  //______________ LOGO-ANIMATION ______________
  showLoginCardAfterAnimation(_event: AnimationEvent) {
    this.showLogin = true;
  }
}
