import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss'
})
/**
 * PrivacyPolicyComponent
 *
 * Displays the privacy policy content. Can be used in different contexts
 * (main app or login page) and emits a back navigation event.
 */
export class PrivacyPolicyComponent {
  /**
   * Input that specifies where this component is displayed.
   * Allows context-specific styling or layout adjustments.
   * @default 'login'
   */
  @Input() context: 'main' | 'login' = 'login';

  /**
   * Emits when the user wants to go back (close this view).
   */
  @Output() back = new EventEmitter<void>();
}
