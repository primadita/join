import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule, NgForm, PatternValidator } from '@angular/forms';
import { UserProfileImageComponent } from '../../../shared/components/user-profile-image/user-profile-image.component';
import { Contact } from '../../../shared/interfaces/contact';
import { FirebaseServiceService } from '../../../shared/services/firebase.service';
import { PatternValidatorDirective } from '../../../shared/directives/pattern-validator.directive';

@Component({
  selector: 'app-edit-contact',
  imports: [CommonModule, FormsModule, UserProfileImageComponent, PatternValidatorDirective],
  templateUrl: './edit-contact.component.html',
  styleUrl: './edit-contact.component.scss'
})

/**
 * Component that handles editing an existing contact.
 * 
 * Provides form functionality for updating, deleting, or closing
 * the contact edit window. Emits corresponding events to the parent component.
 */
export class EditContactComponent {
  // #region ATTRIBUTES
  /**
 * Event emitted when the edit window should be closed.
 * @event
 */
  @Output() close = new EventEmitter<boolean>();

  /**
 * Event emitted when the user saves changes to a contact.
 * Emits a partial `Contact` object containing updated data.
 * @event
 */
  @Output() save = new EventEmitter<Partial<Contact>>();

  /**
 * Event emitted when the user chooses to delete the contact.
 * @event
 */
  @Output() delete = new EventEmitter();

  /**
 * The contact details provided as input for editing.
 */
  // @Input() contactDetails: Contact | null = null;
  @Input() contact!: Contact;

  /**
 * Service injected to handle Firestore contact operations.
 */
  contactService = inject(FirebaseServiceService);

  /**
 * Object holding the editable contact data (bound to the form).
 */
  contactData = {
    name: "",
    mail: "",
    phone: ""
  }
  // #endregion

  // #region METHODS
  /**
 * Lifecycle hook that initializes the component.
 * 
 * Pre-fills the form fields with the provided contact details (if available).
 */
  ngOnInit() {
    if (this.contact) {
      this.contactData = {
        name: this.contact.name,
        mail: this.contact.mail,
        phone: this.contact.phone
      }
    }
  }

  /**
 * Closes the edit window and emits the `close` event.
 */
  closeEditWindow() {
    this.close.emit();
  }


  /**
   * Emits the `save` event with the updated contact data.
   */
  sendSaveInput() {
    this.save.emit(this.contactData);
  }

  /**
 * Emits the `delete` event to notify that the contact should be removed.
 */
  sendDeleteInput() {
    this.delete.emit(this.contactData);
  }

  /**
 * Handles form submission.
 * 
 * When the form is valid and submitted, emits the `save` event.
 * 
 * @param {NgForm} ngForm - The Angular form reference.
 */
  onSubmit(ngForm: NgForm) {
    if (ngForm.form.valid && ngForm.submitted) {
      this.sendSaveInput();
    }
  }
  
  formatName(value: string) {
    if (!value) return;

    this.contactData.name = value
      .toLowerCase()
      .replace(/(^\w|[-'\s]\w)/g, c => c.toUpperCase()); // \w ist für Wortzeichen oder Wortzeichen nach dem Strich oder Apostroph oder Leerzeichen to upper case
  }
  // #endregion
}
