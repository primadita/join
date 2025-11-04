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
  constructor(private router: Router, private authService: AuthService) {}

  login() {
    this.authService
      .login(this.email, this.password)
      .then((userCredential) => {
        console.log('Login erfolgreich: ', userCredential.user.email);
        this.goToApp();
      })
      .catch((error) => {
        console.error('Login fehlgeschlagen: ', error.message);
      });
  }

  loginGuest() {
    const mail = 'gast@email.de';
    const pw = '0123456';
    this.authService
      .login(mail, pw)
      .then((userCredential) => {
        console.log('Login erfolgreich: ', userCredential.user.email);
        this.goToApp();
      })
      .catch((error) => {
        console.error('Login fehlgeschlagen: ', error.message);
      });
  }

  goToApp() {
    this.router.navigateByUrl('/main');
  }

  goToLegalAndPrivacy() {
    this.router.navigateByUrl('/legalAndPrivacy');
  }
}
