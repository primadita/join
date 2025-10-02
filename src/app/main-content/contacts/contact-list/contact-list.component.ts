import { Component, EventEmitter, inject, Output } from '@angular/core';
import { users } from '../../../shared/userData';
import { ContactLabelComponent } from './contact-label/contact-label.component';
import { FirebaseServiceService } from '../../../shared/services/firebase.service';
import { CommonModule, NgFor } from '@angular/common';
import { AddContactComponent } from './add-contact/add-contact.component';
import { Contact } from '../../../shared/interfaces/contact';

@Component({
  selector: 'app-contact-list',
  imports: [ContactLabelComponent, AddContactComponent, CommonModule],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.scss',
})
export class ContactListComponent {
  contactList = inject(FirebaseServiceService);
  @Output() contactSelected = new EventEmitter<Contact>();

  addContactOpen: boolean = false;

  toggleAddContact(): void {
    this.addContactOpen = !this.addContactOpen;
  }
}
