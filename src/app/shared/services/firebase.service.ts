import { inject, Injectable } from '@angular/core';
import { collection, Firestore, onSnapshot } from '@angular/fire/firestore';
import { Contact } from '../interfaces/contact';

@Injectable({
  providedIn: 'root',
})
export class FirebaseServiceService {
  firestore: Firestore = inject(Firestore);

  contactsList: Contact[] = [];
  unsubContacts;

  constructor() {
    this.unsubContacts = this.subContactsList();
  }

  subContactsList() {
    return onSnapshot(this.getContactsRef(), (list) => {
      this.contactsList = [];
      list.forEach((element) => {
        this.contactsList.push(
          this.setContactObject(element.data(), element.id)
        );
      });
    });
  }

  ngonDestroy() {
    this.unsubContacts();
  }

  setActiveContact(id: string) {
    for (const c of this.contactsList) {
      c.active = c.id === id;
    }
  }

  setContactObject(obj: any, id: string): Contact {
    return {
      id,
      name: obj.name,
      mail: obj.mail,
      phone: obj.phone,
      active: obj.active,
      color: obj.bgcolor,
    };
  }

  getContactsRef() {
    return collection(this.firestore, 'contacts');
  }
}
