import { Component, HostListener, inject, signal } from '@angular/core';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { Contact } from '../../shared/interfaces/contact';
import { SelectContactService } from '../../shared/services/select-contact.service';

@Component({
  selector: 'app-contacts',
  imports: [ContactListComponent, ContactDetailsComponent],
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

  @HostListener('window:resize')
  resize() {
    this.breakPoint.set(window.innerWidth > 1300);
  }
}
