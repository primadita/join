import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  inject,
  Input,
  Output,
} from '@angular/core';
import { SectionTitleVLineComponent } from '../../../shared/components/section-title-vline/section-title-vline.component';
import { UserProfileImageComponent } from '../../../shared/components/user-profile-image/user-profile-image.component';
import { SectionHeaderService } from '../../../shared/services/section-header.service';
import { FirebaseServiceService } from '../../../shared/services/firebase.service';
import { UserProfileImageService } from '../../../shared/services/user-profile-image.service';
import { Contact } from '../../../shared/interfaces/contact';
import { FormsModule } from '@angular/forms';
import { EditContactComponent } from '../edit-contact/edit-contact.component';
import { ToastMessageComponent } from '../../../shared/components/toast-message/toast-message.component';
import { ToastMessagesService } from '../../../shared/services/toast-messages.service';
import { updateDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-contact-details',
  imports: [
    CommonModule,
    SectionTitleVLineComponent,
    EditContactComponent,
    UserProfileImageComponent,
    FormsModule,
  ],
  templateUrl: './contact-details.component.html',
  styleUrl: './contact-details.component.scss',
})

/**
 * Component responsible for displaying and managing the details of a selected contact.
 *
 * Provides features for editing, saving, and deleting contact information,
 * as well as navigating back to the contact list.
 * Also integrates with several services for Firestore access, UI updates, and user feedback.
 */
export class ContactDetailsComponent {
  // #region ATTRIBUTES

  /**
   * Injected service providing section header data for various app sections.
   */
  sectionHeaderList = inject(SectionHeaderService);
  contacts = this.sectionHeaderList.sectionHeader.find(
    (e) => e.title === 'Contacts'
  );

  /**
   * Injected service for performing Firestore operations on contacts.
   */
  contactFirebase = inject(FirebaseServiceService);

  /**
   * Injected service for generating user profile colors and initials.
   */
  userProfileService = inject(UserProfileImageService);

  /**
   * Indicates whether the edit contact window is currently open.
   * @default false
   */
  edit: boolean = false;

  /**
   * The currently selected contact being viewed or edited.
   */
  selectedContact!: Contact;

  /**
   * The contact data passed from the parent component.
   * Can be `null` if no contact is currently selected.
   */
  @Input() contact: Contact | null = null;

  /**
   * Event emitted when the user navigates back to the contacts list view.
   * @event
   */
  @Output() back = new EventEmitter<void>();
  // #endregion

  constructor(private toastService: ToastMessagesService) {}

  // #region METHODS

  /**
   * Toggles the edit contact window.
   *
   * If a contact is passed as a parameter, it becomes the selected contact for editing.
   *
   * @param {Contact} [contact] - Optional contact to edit.
   */
  toggleEditContactWindow(contact?: Contact) {
    if (contact) {
      this.selectedContact = contact;
    }
    this.edit = !this.edit;
  }

  /**
   * Deletes a contact by its ID and displays a success toast message.
   *
   * @param {string} id - The ID of the contact to delete.
   */
  deleteContact(id: string) {
    this.contactFirebase.deleteContact(id);
    this.toastService.show('Contact has been deleted!', 'success');
  }

  /**
   * Emits the `back` event to return to the contacts list view.
   */
  backToContactsList() {
    this.back.emit();
  }

  /**
   * Saves updates to the currently selected contact.
   *
   * Merges form data (`updatedData`) with existing contact details,
   * updates the record in Firestore, and displays a success message.
   *
   * @param {Partial<Contact>} updatedData - The updated contact information.
   */
  async saveContact(updatedData: Partial<Contact>) {
    this.selectedContact = {
      id: this.selectedContact.id,
      name: updatedData.name || this.selectedContact.name,
      mail: updatedData.mail || this.selectedContact.mail,
      phone: updatedData.phone || this.selectedContact.phone,
      active: this.selectedContact.active,
    };
    this.contactFirebase.updateContact(this.selectedContact);
    console.log(this.contactFirebase.contactsList);
    await Promise.all(
      this.contactFirebase.contactsList
        .filter((c) => c.id && c.id !== this.selectedContact.id)
        .map((c) =>
          updateDoc(this.contactFirebase.getSingleDocRef(c.id!), {
            active: false,
          })
        )
    );

    this.edit = !this.edit;
    if (window.innerWidth < 640) {
      this.toastService.show('Contact successfully changed!', 'success');
    } else {
      this.toastService.show(
        'Contact has been successfully changed!',
        'success'
      );
    }
  }

  /**
   * Deletes a contact while in the edit window.
   *
   * Closes the edit view and clears the selected contact afterward.
   *
   * @param {Contact} contact - The contact to delete.
   */
  deleteContactonEditWindow(contact: Contact) {
    if (this.selectedContact.id) {
      this.contactFirebase.deleteContact(this.selectedContact.id);
      this.selectedContact = undefined as any;
      this.edit = false;
    }
    this.toastService.show('Contact has been deleted!', 'success');
  }

  // #endregion

  // toggle-state
  isEditPoppUpOpen = false;

  toggleEditPopup() {
    this.isEditPoppUpOpen = !this.isEditPoppUpOpen;
  }

  closeEditPopup() {
    this.isEditPoppUpOpen = false;
  }
}
