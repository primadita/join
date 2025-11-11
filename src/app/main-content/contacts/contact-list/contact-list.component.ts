import { Component, EventEmitter, inject, Output } from '@angular/core';
import { users } from '../../../shared/userData';
import { ContactLabelComponent } from './contact-label/contact-label.component';
import { FirebaseServiceService } from '../../../shared/services/firebase.service';
import { CommonModule, NgFor } from '@angular/common';
import { AddContactComponent } from './add-contact/add-contact.component';
import { Contact } from '../../../shared/interfaces/contact';
import { SelectContactService } from '../../../shared/services/select-contact.service';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [ContactLabelComponent, AddContactComponent, CommonModule],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.scss',
})

/**
 * Component responsible for displaying and managing the list of contacts.
 * 
 * Provides functionality to toggle the contact creation form
 * and emit events when a contact is selected.
 */
export class ContactListComponent {

  /**
   * Injected service that manages Firestore contact operations and data retrieval.
   */
  contactList = inject(FirebaseServiceService);
  

  /**
 * Event emitted when a contact from the list is selected.
 * @event
 */
  @Output() contactSelected = new EventEmitter<Contact>();

  /**
 * Controls the visibility of the "Add Contact" form or modal.
 * @default false
 */
  addContactOpen: boolean = false;

  /**
 * Toggles the visibility of the "Add Contact" form or modal.
 * - If `true`, the form is displayed.
 * - If `false`, the form is hidden.
 */
  toggleAddContact(): void {
    this.addContactOpen = !this.addContactOpen;
  }

  
}
