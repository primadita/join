import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnInit,
  Output,
  output,
  signal,
} from '@angular/core';
import { FirebaseServiceService } from '../../../services/firebase.service';
import { Contact } from '../../../interfaces/contact';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-rp-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rp-search.component.html',
  styleUrl: './rp-search.component.scss',
})
/**
 * RpSearchComponent (Responsible Party Search)
 *
 * Provides a searchable dropdown for selecting contacts to assign to tasks.
 * Supports multi-select, filters out the current user, and emits changes
 * to the parent component.
 */
export class RpSearchComponent implements OnInit {
  // #region ATTRIBUTES
  /**
   * Array of currently selected contacts for task assignment.
   * Received from parent component.
   */
  @Input() selectedContacts!: Contact[];

  /**
   * Emits when the selected contacts list changes.
   */
  @Output() contactsChanged = new EventEmitter<Contact[]>();

  /**
   * Service for accessing all available contacts from Firestore.
   */
  contacts = inject(FirebaseServiceService);

  /**
   * Output that emits a single contact when selected/toggled.
   */
  sendContact = output<Contact>();

  /**
   * Display name of the currently logged-in user.
   */
  currentUserName: string | null | undefined = null;

  /**
   * Email of the currently logged-in user.
   */
  currentUserMail: string | null | undefined = null;

  /**
   * The search input value for filtering contacts.
   */
  searchInput: string = '';

  /**
   * Signal that controls dropdown visibility.
   * @type {Signal<boolean>}
   */
  isListOpen = signal(false);
  // #endregion

  constructor(public el: ElementRef, private authService: AuthService) {}

  // #region METHODS
  /**
   * Component init lifecycle hook.
   *
   * Subscribes to auth state to identify the current user and exclude
   * them from the contact list.
   *
   * @returns {void}
   */
  ngOnInit(): void {
    this.authService.getCurrentUser();
    this.authService.currentUser.subscribe((user) => {
      this.currentUserName = user?.displayName;
      this.currentUserMail = user?.email;
    });
  }

  /**
   * Determines if a contact is the currently logged-in user.
   *
   * @param {Contact} contact - The contact to check
   * @returns {boolean} true if the contact matches the current user
   */
  isCurrentUser(contact: Contact): boolean {
    return this.currentUserName === contact.name && this.currentUserMail === contact.mail;
  }

  /**
   * Generates initials from a contact's full name for avatar display.
   *
   * @param {Contact} contact - The contact whose initials are needed
   * @returns {string} Two-letter initials in uppercase
   */
  getLetters(contact: Contact): string {
    const parts = contact.name.trim().split(' ');
    const first = parts[0]?.[0] || '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    const initials = (first + last).toUpperCase();
    return initials;
  }

  /**
   * Toggles a contact's selection state and emits changes to parent.
   * If selected, adds to array; if already selected, removes from array.
   *
   * @param {Contact} contact - The contact to toggle
   * @returns {void}
   */
  sendContactToParent(contact: Contact): void {
    const index = this.selectedContacts.findIndex(c => c.id === contact.id);

    if (index === -1) {
      // Add contact
      this.selectedContacts.push(contact);
    } else {
      // Remove contact
      this.selectedContacts.splice(index, 1);
    }

    // Emit changes to parent
    this.sendSelectedContactsToParent();
  }

  /**
   * Emits the current selection to the parent component.
   *
   * @returns {void}
   */
  sendSelectedContactsToParent(): void {
    this.contactsChanged.emit(this.selectedContacts);
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
    return this.contacts.contactsList.slice().sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
  }

  /**
   * Checks whether a contact is in the currently selected array.
   *
   * @param {Contact} contact - The contact to check
   * @returns {boolean} true if selected
   */
  checkSelectedRp(contact: Contact): boolean {
    return this.selectedContacts.some(c => c.id === contact.id);
  }

  /**
   * Filters the sorted contact list by the current search input.
   *
   * @returns {Contact[]} Contacts whose names include the search term (case-insensitive)
   */
  searchContact(): Contact[] {
    const lowerSearch = this.searchInput.toLowerCase();
    const foundContacts = this.sortedContacts().filter((contact) =>
      contact.name.toLowerCase().includes(lowerSearch)
    );
    return foundContacts;
  }

  /**
   * Close the dropdown list.
   *
   * @returns {void}
   */
  closeList(): void {
    this.isListOpen.set(false);
  }

  /**
   * Open the dropdown list when focus is received.
   *
   * @returns {void}
   */
  onFocus(): void {
    this.isListOpen.set(true);
  }

  /**
   * Toggle the dropdown list visibility when a button is focused.
   *
   * @returns {void}
   */
  onFocusButton(): void {
    if (this.isListOpen()) {
      this.isListOpen.set(false);
    } else {
      this.isListOpen.set(true);
    }
  }

  /**
   * Close the dropdown when clicking outside the component.
   *
   * @param {MouseEvent} event - The click event
   * @returns {void}
   */
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.isListOpen.set(false);
    }
  }
  // #endregion
}
