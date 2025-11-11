import { Component, inject, Input } from '@angular/core';
import { ToastMessagesService } from '../../services/toast-messages.service';
import { CommonModule } from '@angular/common';
import { Messages } from '../../interfaces/messages';

@Component({
  selector: 'app-toast-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast-message.component.html',
  styleUrl: './toast-message.component.scss'
})

/**
 * Component responsible for displaying temporary toast messages in the UI.
 * 
 * Listens to message updates from the `ToastMessagesService` and
 * automatically hides each message after a short duration.
 */
export class ToastMessageComponent {
  // #region ATTRIBUTES
  /**
   * The current toast message to display.
   * - `null` means no active message is being shown.
   */
  message: Messages | null = null;

  /**
   * Input that specifies the context/page where the toast is shown.
   * Used to apply context-specific styling or behavior.
   * @default 'board'
   */
  @Input() context: 'contacts' | 'addtask' | 'board' | 'edittask' | 'signup' = 'board';
  // #endregion

  constructor(private toastService: ToastMessagesService) { }

  // #region METHODS
  /**
   * Component init lifecycle hook.
   *
   * Subscribes to the `toastStatus` observable from `ToastMessagesService`
   * and updates the displayed message accordingly.
   * Each message automatically disappears after 3 seconds.
   *
   * @returns {void}
   */
  ngOnInit(): void {
    this.toastService.toastStatus.subscribe(msg => {
      this.message = msg;
      setTimeout(() => this.message = null, 3000);
    });
  }
  // #endregion
}
