import { inject, Injectable } from '@angular/core';
import {
  collection,
  deleteDoc,
  Firestore,
  onSnapshot,
  doc,
  addDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Contact } from '../interfaces/contact';
import { ToastMessagesService } from './toast-messages.service';

/**
 * Service for managing contacts in Firestore.
 * Provides CRUD operations and real-time updates for the contacts collection.
 */
@Injectable({
  providedIn: 'root',
})
export class FirebaseServiceService {
  // #region ATTRIBUTES
  /** Firestore instance */
  firestore: Firestore = inject(Firestore);

  /** List of contacts currently loaded */
  contactsList: Contact[] = [];

  /** Function to unsubscribe from Firestore listener */
  unsubContacts;
  // #endregion

  /**
   * Initializes the service and subscribes to the contacts collection.
   * @param toastService Service for displaying toast notifications.
   */
  constructor(private toastService: ToastMessagesService) {
    this.unsubContacts = this.subContactsList();
  }

  // #region METHODS
  /**
   * Subscribes to real-time updates from the Firestore contacts collection.
   * Updates the local contactsList whenever changes occur.
   * @returns Unsubscribe function to stop listening for changes.
   */
  subContactsList() {
    return onSnapshot(this.getContactsRef(), (list) => {
      this.contactsList = [];
      list.forEach((element) => {
        this.contactsList.push(
          this.setContactObject(element.data(), element.id)
        );
      });
    });
  }

  /**
   * Cleans up Firestore subscriptions when the component is destroyed.
   */
  ngonDestroy() {
    this.unsubContacts();
  }

  /**
   * Sets the active contact by its ID.
   * Updates the 'active' property for each contact in contactsList.
   * @param id The ID of the contact to set as active.
   */
  setActiveContact(id: string) {
    for (const c of this.contactsList) {
      c.active = c.id === id;
    }
  }

  /**
   * Maps Firestore document data to a Contact object.
   * @param obj Raw Firestore document data.
   * @param id Document ID.
   * @returns A structured Contact object.
   */
  setContactObject(obj: any, id: string): Contact {
    return {
      id: id,
      name: obj.name,
      mail: obj.mail ,
      phone: obj.phone ,
      bgColor: obj.bgColor || obj.bgcolor,
    };
  }

  /**
   * Returns a Firestore reference to the contacts collection.
   * @returns Firestore contacts collection reference.
   */
  getContactsRef() {
    return collection(this.firestore, 'contacts');
  }

  /**
   * Returns a Firestore document reference for a specific contact.
   * @param id The ID of the contact.
   * @returns Firestore document reference for the contact.
   */
  getSingleDocRef(id: string) {
    return doc(collection(this.firestore, 'contacts'), id);
  }

  /**
   * Deletes a contact from Firestore by its ID.
   * Displays an error toast message if the operation fails.
   * @param id The ID of the contact to delete.
   * @returns Promise that resolves when the deletion is complete.
   */
  async deleteContact(id: string) {
    await deleteDoc(this.getSingleDocRef(id)).catch((err) => {
      this.toastService.show('Error: ' + (err || 'Unknown error'), 'error');
    });
  }

  /**
   * Adds a new contact to Firestore.
   * @param item The contact object to add.
   * @returns Promise that resolves with the newly created contact object.
   */
  async addContact(item: Contact) {
    const docRef = await addDoc(this.getContactsRef(), item);
    const newContact: Contact = {
      id: docRef.id,
      name: item.name,
      mail: item.mail,
      phone: item.phone,
      bgColor: item.bgColor
    }
    return newContact;
  }

  /**
   * Updates an existing contact in Firestore.
   * Displays an error toast message if the operation fails.
   * @param contact The contact object with updated values.
   * @returns Promise that resolves when the contact is updated.
   */
  async updateContact(contact: Contact) {
    if (contact.id) {
      let contactRef = this.getSingleDocRef(contact.id);
      await updateDoc(contactRef, this.getCleanJson(contact)).catch((err) => {
        this.toastService.show('Error: ' + (err || 'Unknown error'), 'error');
      });
    }
  }

  /**
   * Prepares a clean JSON object for Firestore update.
   * Only includes relevant fields for updating a contact.
   * @param contact The contact object.
   * @returns Cleaned JSON object with selected fields.
   */
  getCleanJson(contact: Contact) {
    return {
      name: contact.name,
      mail: contact.mail,
      phone: contact.phone,
      id: contact.id,
    };
  }

  /**
   * Returns the current number of contacts plus one.
   * Used to determine which background color to assign to a new contact.
   * @returns The new contact index (existing contacts + 1).
   */
  getContactsLength(): number {
    const arrayLength = this.contactsList.length;
    return arrayLength + 1;
  }
  // #endregion
}
