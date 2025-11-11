import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
/**
 * FooterComponent
 *
 * Displays footer content with navigation links. Context-aware styling
 * for different pages (login vs register).
 */
export class FooterComponent {
  // #region ATTRIBUTES
  /**
   * Input that specifies where this footer appears.
   * Used to apply context-specific links or styling.
   * @default 'login'
   */
  @Input() context: 'login' | 'register' = 'login';
  // #endregion

  constructor(private router: Router){}
}
