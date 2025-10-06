import { Injectable, signal } from '@angular/core';
import { Contact } from '../interfaces/contact';

@Injectable({
  providedIn: 'root'
})
export class SelectContactService {

  selectedContact = signal<Contact | null>(null);



  constructor() { }

    selectContact(c: Contact) {
    this.selectedContact.set(c);
  }

  
  backToContactsList() {
    this.selectedContact.set(null);
  }
}
