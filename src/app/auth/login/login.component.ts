import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(private router: Router) {}

  goToApp() {
    this.router.navigateByUrl('/main');
  }

  goToLegalAndPrivacy() {
    this.router.navigateByUrl('/legalAndPrivacy');
  }
}
