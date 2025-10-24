import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  inject,
  output,
  signal,
} from '@angular/core';
import { FirebaseServiceService } from '../../../services/firebase.service';
import { Contact } from '../../../interfaces/contact';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rp-search',
  imports: [CommonModule, FormsModule],
  templateUrl: './rp-search.component.html',
  styleUrl: './rp-search.component.scss',
})
export class RpSearchComponent {
  contacts = inject(FirebaseServiceService);

  rpArray: Array<Contact> = [];

  changeAssignedArray = output<Array<Contact>>();

  searchInput: string = '';

  constructor(public el: ElementRef) {}

  getLetters(contact: Contact): string {
    const parts = contact.name.trim().split(' ');
    const first = parts[0]?.[0] || '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    const initials = (first + last).toUpperCase();
    return initials;
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

  addRpToArray(contact: Contact) {
    const array = this.rpArray;
    const test = array.includes(contact);
    if (!test) {
      array.push(contact);
    } else if (test) {
      const index = array.indexOf(contact);
      array.splice(index, 1);
    }
    this.changeAssignedArray.emit(array);
  }

  checkSelectedRp(contact: Contact): boolean {
    if (this.rpArray.includes(contact)) {
      return true;
    } else {
      return false;
    }
  }

  searchContact() {
    const lowerSearch = this.searchInput.toLowerCase();
    const foundContacts = this.sortedContacts().filter((contact) =>
      contact.name.toLowerCase().includes(lowerSearch)
    );
    return foundContacts;
  }

  // #region Input-Signal

  isListOpen = signal(false);

  closeList() {
    this.isListOpen.set(false);
  }

  clearRpList(){
    this.rpArray = [];
  }

  onFocus() {
    this.isListOpen.set(true);
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.isListOpen.set(false);
    }
  }
}
