import { Component, effect, HostListener, inject, signal } from '@angular/core';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { SelectContactService } from '../../shared/services/select-contact.service';
import { CommonModule } from '@angular/common';
import { ToastMessageComponent } from '../../shared/components/toast-message/toast-message.component';

@Component({
  selector: 'app-contacts',
  imports: [CommonModule, ContactListComponent, ContactDetailsComponent, ToastMessageComponent],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})

/**
 * Component responsible for displaying and managing the contacts view.
 * 
 * Handles layout responsiveness and manages contact selection
 * through the `SelectContactService`.
 */
export class ContactsComponent {
  // #region ATTRIBUTES
  /**
   * Reactive signal indicating whether the current layout
   * should display in desktop or mobile mode.
   *
   * - `true` → desktop layout (width > 1300px)
   * - `false` → mobile layout (width ≤ 1300px)
   */
  breakPoint = signal(window.innerWidth > 1300);

  /**
   * Injected service used to manage and track the currently selected contact.
   */
  selectService = inject(SelectContactService);
  // #endregion

  // #region METHODS
  /**
   * Updates the breakpoint signal on window resize.
   */
  @HostListener('window:resize')
  resize() {
    this.breakPoint.set(window.innerWidth > 1300);
  }
  // #endregion
}
