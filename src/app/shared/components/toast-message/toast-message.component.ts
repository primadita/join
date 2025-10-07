import { Component, inject } from '@angular/core';
import { ToastMessagesService } from '../../services/toast-messages.service';
import { CommonModule } from '@angular/common';
import { Messages } from '../../interfaces/messages';

@Component({
  selector: 'app-toast-message',
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

  /**
 * The current toast message to display.
 * - `null` means no active message is being shown.
 */
  message: Messages | null = null;

  constructor(private toastService: ToastMessagesService) { }

  /**
 * Lifecycle hook that initializes the component.
 * 
 * Subscribes to the `toastStatus` observable from `ToastMessagesService`
 * and updates the displayed message accordingly.  
 * Each message automatically disappears after 3 seconds.
 */
  ngOnInit() {
    this.toastService.toastStatus.subscribe(msg => {
      this.message = msg;
      setTimeout(() => this.message = null, 3000);
    });
  }
}
