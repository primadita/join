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
   * Creates an instance of FirebaseServiceService.
   * @param {ToastMessagesService} toastService - Service for showing toast messages.
   */
  constructor(private toastService: ToastMessagesService) {
    this.unsubContacts = this.subContactsList();
  }

  // #region METHODS
  /**
   * Subscribes to the Firestore contacts collection and updates `contactsList` in real-time.
   * @returns {Function} Unsubscribe function to stop listening for changes.
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
   * Lifecycle hook to clean up subscriptions on component destruction.
   */
  ngonDestroy() {
    this.unsubContacts();
  }

  /**
   * Sets the active contact by ID.
   * @param {string} id - The ID of the contact to activate.
   */
  setActiveContact(id: string) {
    for (const c of this.contactsList) {
      c.active = c.id === id;
    }
  }

  /**
   * Maps Firestore document data to a Contact object.
   * @param {any} obj - The raw Firestore document data.
   * @param {string} id - The document ID.
   * @returns {Contact} A properly structured contact object.
   */
  setContactObject(obj: any, id: string): Contact {
    return {
      id: id,
      name: obj.name,
      mail: obj.mail ,
      phone: obj.phone ,
      // active: obj.active ,
      bgColor: obj.bgColor || obj.bgcolor,
    };
  }

  /**
   * Gets a Firestore reference to the contacts collection.
   * @returns {CollectionReference} Firestore contacts collection reference.
   */
  getContactsRef() {
    return collection(this.firestore, 'contacts');
  }

  /**
   * Gets a Firestore document reference for a single contact.
   * @param {string} id - The ID of the contact.
   * @returns {DocumentReference} Firestore document reference for the contact.
   */
  getSingleDocRef(id: string) {
    return doc(collection(this.firestore, 'contacts'), id);
  }

  /**
   * Deletes a contact by ID from Firestore.
   * @param {string} id - The ID of the contact to delete.
   * @returns {Promise<void>} Promise that resolves when the deletion is complete.
   */
  async deleteContact(id: string) {
    await deleteDoc(this.getSingleDocRef(id)).catch((err) => {
      this.toastService.show('Error: ' + (err || 'Unknown error'), 'error');
    });
  }

  /**
   * Adds a new contact to Firestore.
   * @param {Contact} item - The contact object to add.
   * @returns {Promise<void>} Promise that resolves when the contact is added.
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
    // this.contactsList.push(newContact);
    return newContact;
  }

  /**
   * Updates an existing contact in Firestore.
   * @param {Contact} contact - The contact object with updated values.
   * @returns {Promise<void>} Promise that resolves when the contact is updated.
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
   * @param {Contact} contact - The contact object.
   * @returns {Object} Cleaned JSON with only relevant fields.
   */
  getCleanJson(contact: Contact) {
    return {
      name: contact.name,
      mail: contact.mail,
      phone: contact.phone,
      id: contact.id,
      // active: contact.active,
    };
  }
  // #endregion
}
