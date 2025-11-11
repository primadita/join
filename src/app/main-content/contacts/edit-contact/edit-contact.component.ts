import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule, NgForm, PatternValidator } from '@angular/forms';
import { UserProfileImageComponent } from '../../../shared/components/user-profile-image/user-profile-image.component';
import { Contact } from '../../../shared/interfaces/contact';
import { FirebaseServiceService } from '../../../shared/services/firebase.service';
import { PatternValidatorDirective } from '../../../shared/directives/pattern-validator.directive';

@Component({
  selector: 'app-edit-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, UserProfileImageComponent, PatternValidatorDirective],
  templateUrl: './edit-contact.component.html',
  styleUrl: './edit-contact.component.scss'
})

/**
 * EditContactComponent
 *
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
  @Output() delete = new EventEmitter<Contact>();

  /**
   * The contact details provided as input for editing.
   */
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
  };
  // #endregion

  // #region METHODS
  /**
   * Component init lifecycle hook.
   *
   * Pre-fills the form fields with the provided contact details (if available).
   *
   * @returns {void}
   */
  ngOnInit(): void {
    if (this.contact) {
      this.contactData = {
        name: this.contact.name,
        mail: this.contact.mail,
        phone: this.contact.phone
      };
    }
  }

  /**
   * Closes the edit window and emits the `close` event.
   *
   * @returns {void}
   */
  closeEditWindow(): void {
    this.close.emit();
  }

  /**
   * Emits the `save` event with the updated contact data.
   *
   * @returns {void}
   */
  sendSaveInput(): void {
    this.save.emit(this.contactData);
  }

  /**
   * Emits the `delete` event to notify that the contact should be removed.
   *
   * @returns {void}
   */
  sendDeleteInput(): void {
    this.delete.emit();
  }

  /**
   * Handles form submission.
   *
   * When the form is valid and submitted, emits the `save` event.
   *
   * @param {NgForm} ngForm - The Angular form reference.
   * @returns {void}
   */
  onSubmit(ngForm: NgForm): void {
    if (ngForm.form.valid && ngForm.submitted) {
      this.sendSaveInput();
    }
  }

  /**
   * Formats the contact name: converts to lowercase and then capitalizes
   * the first letter after spaces, hyphens, and apostrophes.
   *
   * @param {string} value - The raw name input
   * @returns {void}
   */
  formatName(value: string): void {
    if (!value) return;

    this.contactData.name = value
      .toLowerCase()
      .replace(/(^\w|[-'\s]\w)/g, c => c.toUpperCase());
  }
  // #endregion
}
