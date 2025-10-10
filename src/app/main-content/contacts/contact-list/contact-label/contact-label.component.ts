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
 * Component responsible for rendering and managing the list of contact labels.
 *
 * Provides functionality to:
 * - Select an active contact.
 * - Group contacts alphabetically by their first name letter.
 * - Sort contacts alphabetically.
 * - Generate initials for contact avatars.
 */
export class ContactLabelComponent {
  // #region ATTRIBUTES
  /**
   * Injected service that manages and provides access to contact data.
   */
  contactList = inject(FirebaseServiceService);
  selectService = inject(SelectContactService);

  /**
   * Event emitted when a contact is selected from the list.
   * @event
   */
  @Output() select = new EventEmitter<Contact>();

  /**
   * ID of the currently active contact.
   */
  activeContactId?: string;
  // #endregion

  // #region METHODS
  /**
   * Sets the given contact as the active one and emits a `select` event.
   *
   * @param {Contact} contact - The contact to set as active.
   */
  activeContact(contact: Contact) {
    this.activeContactId = contact.id;
    this.contactList.setActiveContact(contact.id);
    this.select.emit(contact);
  }

  /**
   * Groups all contacts by the first letter of their name (A, B, C, ...).
   *
   * @example
   * Returns an object like:
   * ```typescript
   * {
   *   "A": [Contact, Contact, ...],
   *   "B": [Contact, ...],
   * }
   * ```
   *
   * @returns {Record<string, Contact[]>} An object where each key is a letter and each value is an array of contacts.
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
   * Returns an alphabetically sorted copy of the contact list.
   *
   * - Sorting is case-insensitive.
   * - The original data in the service remains unchanged (due to use of `slice()`).
   *
   * @returns {Contact[]} A new array containing contacts sorted by name.
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
   * Generates initials from the full name of a contact.
   *
   * Examples:
   * - `"Anna Müller"` → `"AM"`
   * - `"Jean-Paul Sartre"` → `"JS"` (supports hyphenated and multi-part names)
   *
   * @param {Contact} contact - The contact whose initials should be generated.
   * @returns {string} The generated initials in uppercase.
   */
  getLetters(contact: Contact): string {
    const parts = contact.name.trim().split(' ');
    const first = parts[0]?.[0] || '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    const initials = (first + last).toUpperCase();
    return initials;
  }

  /**
   * Marks a contact as active and emits a `select` event.
   * (Appears to be a duplicate of `activeContact()`; may serve as an alias.)
   *
   * @param {Contact} contact - The contact to activate and emit.
   */
  onActice(contact: Contact) {
    this.contactList.setActiveContact(contact.id);
    this.select.emit(contact);
  }

  selectContact(contact: Contact){
    this.selectService.selectContact(contact);
  }
  // #endregion
}
