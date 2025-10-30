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
import { ToastMessagesService } from '../../../shared/services/toast-messages.service';
import { SelectContactService } from '../../../shared/services/select-contact.service';

@Component({
  selector: 'app-contact-details',
  standalone: true,
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
 * Component for displaying and managing the details of a selected contact.
 *
 * Features include editing, saving, and deleting contact information,
 * navigating back to the contact list, and integration with Firestore and UI services.
 */
export class ContactDetailsComponent {
  // #region ATTRIBUTES

  /**
   * Service providing section header data for different app sections.
   */
  sectionHeaderList = inject(SectionHeaderService);

  /**
   * Section header configuration for contacts.
   */
  contacts = this.sectionHeaderList.sectionHeader.find(
    (e) => e.title === 'Contacts'
  );

  /**
   * Service for Firestore operations on contacts.
   */
  contactFirebase = inject(FirebaseServiceService);

  /**
   * Service for selecting contacts.
   */
  selectService = inject(SelectContactService);

  /**
   * Service for generating user profile colors and initials.
   */
  userProfileService = inject(UserProfileImageService);

  /**
   * Indicates whether the edit contact window is open.
   */
  edit: boolean = false;

  /**
   * The contact currently selected for viewing or editing.
   */
  selectedContact: Contact | null = null;

  /**
   * Contact data passed from the parent component.
   */
  @Input() contact: Contact | null = null;

  /**
   * Emits when the user navigates back to the contacts list.
   */
  @Output() back = new EventEmitter<void>();

  /**
   * Indicates if the edit popup is open.
   */
  isEditPoppUpOpen = false;
  // #endregion

  /**
   * Creates an instance of ContactDetailsComponent.
   * @param toastService Service for displaying toast notifications.
   */
  constructor(private toastService: ToastMessagesService) {}

  // #region METHODS

  /**
   * Returns the currently selected contact from the selection service.
   */
  get singlecontact(): Contact | null {
    return this.selectService.selectedContact();
  }

  /**
   * Toggles the edit contact window.
   * If a contact is provided, sets it as the selected contact for editing.
   * @param contact Optional contact to edit.
   */
  toggleEditContactWindow(contact?: Contact) {
    if (contact) {
      this.selectedContact = contact;
    }
    this.isEditPoppUpOpen = false;
    this.edit = !this.edit;
  }

  /**
   * Deletes a contact by its ID and shows a success toast message.
   * Navigates back to the contacts list after deletion.
   * @param id The ID of the contact to delete.
   */
  deleteContact(id?: string) {
    if(!id) return;
    this.contactFirebase.deleteContact(id);
    this.selectService.backToContactsList();
    this.toastService.show('Contact has been deleted!', 'success');
  }

  /**
   * Emits the back event to return to the contacts list view.
   */
  backToContactsList() {
    this.back.emit();
  }

  /**
   * Saves updates to the currently selected contact.
   * Merges updated data with existing contact details, updates Firestore,
   * and shows a success toast message.
   * @param updatedData The updated contact information.
   */
  async saveContact(updatedData: Partial<Contact>) {
    if(this.selectedContact){
      const updatedContact:Contact = {
      id: this.selectedContact.id,
      name: updatedData.name || this.selectedContact.name,
      mail: updatedData.mail || this.selectedContact.mail,
      phone: updatedData.phone || this.selectedContact.phone,
    };
    await this.contactFirebase.updateContact(updatedContact);
      const fresh = this.contactFirebase.contactsList.find(
        c => c.id === updatedContact.id
      );
      this.selectService.selectContact(fresh || updatedContact);
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
  }

  /**
   * Deletes a contact while in the edit window.
   * Closes the edit view and clears the selected contact.
   * @param contact The contact to delete.
   */
  deleteContactonEditWindow(contact: Contact) {
    if(this.selectedContact){
      if (this.selectedContact.id) {
      this.contactFirebase.deleteContact(this.selectedContact.id);
      this.selectedContact = undefined as any;
      this.selectService.backToContactsList();
      this.edit = false;
    }
    this.toastService.show('Contact has been deleted!', 'success');
    }
    
  }

  /**
   * Toggles the edit popup window.
   */
  toggleEditPopup() {
    this.isEditPoppUpOpen = !this.isEditPoppUpOpen;
  }

  /**
   * Closes the edit popup window.
   */
  closeEditPopup() {
    this.isEditPoppUpOpen = false;
  }
  // #endregion
}
