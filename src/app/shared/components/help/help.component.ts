import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { OutletContext } from '@angular/router';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './help.component.html',
  styleUrl: './help.component.scss'
})
/**
 * HelpComponent
 *
 * Displays help/support content for users. Emits an event when the user
 * wants to navigate back.
 */
export class HelpComponent {
  /**
   * Emits when the user wants to navigate back (close this help view).
   */
  @Output() back = new EventEmitter<void>();
}
