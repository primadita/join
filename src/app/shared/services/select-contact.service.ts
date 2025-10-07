import { Injectable, signal } from '@angular/core';
import { Contact } from '../interfaces/contact';

@Injectable({
  providedIn: 'root'
})

/**
 * Service to manage the currently selected contact.
 * 
 * Provides reactive state management using Angular signals,
 * allowing components to subscribe to changes in the selected contact.
 */
export class SelectContactService {

  /**
 * Reactive signal holding the currently selected contact.
 * - `null` indicates that no contact is currently selected.
 */
  selectedContact = signal<Contact | null>(null);



  constructor() { }

    /**
   * Sets the given contact as the currently selected contact.
   *
   * @param {Contact} c - The contact to set as selected.
   */
  selectContact(c: Contact) {
    this.selectedContact.set(c);
  }


    /**
   * Resets the selected contact to `null`,
   * typically used to navigate back to the contacts list.
   */
  backToContactsList() {
    this.selectedContact.set(null);
  }
}
