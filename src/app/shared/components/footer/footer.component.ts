import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  // #region ATTRIBUTES
  @Input() context: 'login' | 'register' = 'login';
  // #endregion

  constructor(private router: Router){}

  // #region METHODS
  // #endregion
}
