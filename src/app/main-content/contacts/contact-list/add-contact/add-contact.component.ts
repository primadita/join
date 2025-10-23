import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { FirebaseServiceService } from '../../../../shared/services/firebase.service';
import { Contact } from '../../../../shared/interfaces/contact';
import { UserProfileImageService } from '../../../../shared/services/user-profile-image.service';

import { updateDoc } from '@angular/fire/firestore';
import { SelectContactService } from '../../../../shared/services/select-contact.service';
import { ToastMessagesService } from '../../../../shared/services/toast-messages.service';
import { PatternValidatorDirective } from "../../../../shared/directives/pattern-validator.directive";

@Component({
  selector: 'app-add-contact',
  imports: [CommonModule, FormsModule, PatternValidatorDirective],
  templateUrl: './add-contact.component.html',
  styleUrl: './add-contact.component.scss',
})

/**
 * Component for adding a new contact to Firestore.
 * 
 * Handles form submission, user feedback, loading state, and success messages.
 * Automatically deactivates previously active contacts after adding a new one.
 */
export class AddContactComponent {
  // #region ATTRIBUTES

  /**
   * Service for managing user profile visuals (background colors, initials, etc.).
   */
  userProfileBackground = inject(UserProfileImageService);

  /**
   * Service for managing selected contacts.
   */
  selectService = inject(SelectContactService);

  /**
   * Firestore service for accessing and updating contact data.
   */
  contactList = inject(FirebaseServiceService);

  /**
   * Holds user input data for creating a new contact.
   */
  contactData = {
    name: '',
    email: '',
    phone: '',
  };

  /**
   * Emits to toggle the visibility of the add-contact popup.
   */
  @Output() getActive = new EventEmitter<boolean>();

  /**
   * Emits when a newly created contact should be selected.
   */
  @Output() select = new EventEmitter<Contact>();

  /**
   * Indicates whether the loading screen is currently active.
   */
  loadingActive: boolean = false;
  // #endregion

  /**
   * Creates an instance of AddContactComponent.
   * @param contactService Service for Firestore contact operations.
   * @param toastMessage Service for displaying toast notifications.
   */
  constructor(private contactService: FirebaseServiceService, private toastMessage: ToastMessagesService) { }

  // #region METHODS

  /**
   * Emits the selected contact via the select event.
   * @param contact The contact that has been selected.
   */
  activeContact(contact: Contact) {
    this.select.emit(contact);
  }

  /**
   * Emits the getActive event to toggle the popup state.
   */
  sendStatus() {
    this.getActive.emit();
  }

  /**
   * Adds a new contact to Firestore.
   * - Activates the loading screen.
   * - Creates a new contact object.
   * - Adds it to Firestore.
   * - Selects the new contact.
   * - Closes the popup and shows a success message.
   */
  async addContact() {
    this.toggleLoadingScreen();
    const contact = this.createContact();
    const newContact = await this.contactService.addContact(contact);
    this.selectService.selectContact(newContact);
    this.closePopUp(contact);
  }

  /**
   * Creates a new contact object using form data and assigns a background color.
   * @returns The newly created contact object.
   */
  createContact(): Contact {
    let contact: Contact = {
      name: this.contactData.name,
      mail: this.contactData.email,
      phone: this.contactData.phone,
      id: '',
      // active: true,
      bgColor: this.userProfileBackground.getBackgroundColor(
        this.getContactsLength()
      ),
    };
    return contact;
  }

  /**
   * Deactivates all contacts in the local contact list.
   */
  deactivateContacts() {
    for (let i = 0; i < this.contactService.contactsList.length; i++) {
      this.contactList.contactsList[i].active = false;
    }
  }

  /**
   * Handles form submission.
   * If the form is valid and submitted, triggers addContact().
   * @param ngForm The Angular form reference.
   */
  onSubmit(ngForm: NgForm) {
    if (ngForm.valid && ngForm.submitted) {
      this.addContact();
    }
  }

  /**
   * Toggles the loading screen on or off.
   */
  toggleLoadingScreen() {
    this.loadingActive = !this.loadingActive;
  }

  /**
   * Closes the "Add Contact" popup, updates the selected contact, and shows a success message.
   * @param contact The contact that was just created.
   */
  closePopUp(contact: Contact) {
    this.sendStatus();
    this.toggleLoadingScreen();
    if (window.innerWidth < 640) {
      this.toastMessage.show("Contact successfully created", "success");
    } else {
      this.toastMessage.show("Contact has been succesfully created", "success");
    }
  }

  /**
   * Returns the current number of contacts plus one.
   * Used to determine which background color to assign to a new contact.
   * @returns The new contact index (existing contacts + 1).
   */
  getContactsLength(): number {
    const arrayLength = this.contactService.contactsList.length;
    return arrayLength + 1;
  }

  formatName(value: string) {
  if (!value) return;

  this.contactData.name = value
    .toLowerCase()
    .replace(/(^\w|[-'\s]\w)/g, c => c.toUpperCase()); // \w ist für Wortzeichen oder Wortzeichen nach dem Strich oder Apostroph oder Leerzeichen to upper case
}
  // #endregion
}

