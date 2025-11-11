import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-legal-notice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './legal-notice.component.html',
  styleUrl: './legal-notice.component.scss'
})
/**
 * LegalNoticeComponent
 *
 * Displays the legal notice (Impressum) content. Can be shown in different
 * contexts and emits a back navigation event when the user wants to exit.
 */
export class LegalNoticeComponent {
  /**
   * Input that specifies the context where this component is shown.
   * Allows for context-specific styling or layout.
   * @default 'login'
   */
  @Input() context: 'main' | 'login' = 'login';

  /**
   * Emits when the user wants to navigate back (close this view).
   */
  @Output() back = new EventEmitter<void>();
}
