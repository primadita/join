import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FirebaseServiceService } from '../../../../shared/services/firebase.service';
import { Contact } from '../../../../shared/interfaces/contact';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { SelectContactService } from '../../../../shared/services/select-contact.service';

@Component({
  selector: 'app-contact-label',
  standalone: true,
  imports: [CommonModule, KeyValuePipe],
  templateUrl: './contact-label.component.html',
  styleUrl: './contact-label.component.scss',
})

/**
 * Component for rendering and managing the list of contact labels.
 *
 * Features:
 * - Selects an active contact.
 * - Groups contacts alphabetically by the first letter of their name.
 * - Sorts contacts alphabetically.
 * - Generates initials for contact avatars.
 */
export class ContactLabelComponent {
  // #region ATTRIBUTES
  /**
   * Service for managing and accessing contact data.
   */
  contactList = inject(FirebaseServiceService);

  /**
   * Service for selecting contacts.
   */
  selectService = inject(SelectContactService);

  /**
   * Emits when a contact is selected from the list.
   */
  @Output() select = new EventEmitter<Contact>();

  /**
   * ID of the currently active contact.
   */
  activeContactId?: string;
  // #endregion

  // #region METHODS
  /**
   * Sets the given contact as active and emits a select event.
   * @param contact The contact to set as active.
   */
  activeContact(contact: Contact) {
    this.activeContactId = contact.id;
    this.contactList.setActiveContact(contact.id);
    this.select.emit(contact);
  }

  /**
   * Groups contacts by the first letter of their name.
   * @returns An object where each key is a letter and each value is an array of contacts.
   */
  groupedContacts() {
    const groups: any = {};

    for (let contact of this.sortedContacts()) {
      const letter = contact.name[0].toUpperCase();
      if (!groups[letter]) {
        groups[letter] = [];
      }
      groups[letter].push(contact);
    }
    return groups;
  }

  /**
   * Returns a copy of the contact list sorted alphabetically by name (case-insensitive).
   * @returns Array of contacts sorted by name.
   */
  sortedContacts(): Contact[] {
    return this.contactList.contactsList.slice().sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
  }

  /**
   * Generates initials from the contact's full name.
   * Examples:
   * - "Anna Müller" → "AM"
   * - "Jean-Paul Sartre" → "JS"
   * @param contact The contact whose initials are generated.
   * @returns The initials in uppercase.
   */
  getLetters(contact: Contact): string {
    const parts = contact.name.trim().split(' ');
    const first = parts[0]?.[0] || '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    const initials = (first + last).toUpperCase();
    return initials;
  }

  /**
   * Marks a contact as active and emits a select event.
   * Alias for activeContact().
   * @param contact The contact to activate and emit.
   */
  onActice(contact: Contact) {
    this.contactList.setActiveContact(contact.id);
    this.select.emit(contact);
  }

  /**
   * Selects a contact using the selection service.
   * @param contact The contact to select.
   */
  selectContact(contact: Contact){
    this.selectService.selectContact(contact);
  }
  // #endregion
}