import { Component, HostListener, inject, signal } from '@angular/core';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { Contact } from '../../shared/interfaces/contact';
import { SelectContactService } from '../../shared/services/select-contact.service';

@Component({
  selector: 'app-contacts',
  imports: [ContactListComponent, ContactDetailsComponent],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent {
  // selectedContact = signal<Contact | null>(null);
  breakPoint = signal(window.innerWidth > 1300);

  selectService = inject(SelectContactService);

  // selectContact(c: Contact) {
  //   this.selectedContact.set(c);
  // }
  @HostListener('window:resize')
  resize() {
    this.breakPoint.set(window.innerWidth > 1300);
  }

  // backToContactsList() {
  //   this.selectedContact.set(null);
  // }
}
