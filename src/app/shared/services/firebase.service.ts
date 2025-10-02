import { inject, Injectable } from '@angular/core';
import { collection, deleteDoc, Firestore, onSnapshot, doc, addDoc, updateDoc } from '@angular/fire/firestore';
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
      id: id,
      name: obj.name,
      mail: obj.mail,
      phone: obj.phone,
      active: obj.active,
      bgColor: obj.bgColor || obj.bgcolor
    };
  }

  getContactsRef() {
    return collection(this.firestore, 'contacts');
  }

  getSingleDocRef(id: string) {
    return doc(collection(this.firestore, 'contacts'), id);
  }


  async deleteContact(id: string) {
    await deleteDoc(this.getSingleDocRef(id)).catch((err) => {
      console.error(err);
    })
  }

  async addContact(item: Contact){
    await addDoc(this.getContactsRef(), item).catch(
      (err) => {console.error(err);
      }
    ).then(
      (docRef) => {console.log("Document written with ID: ", docRef?.id)}
    )
  }

  async updateContact(contact: Contact){
    if(contact.id){
      let contactRef = this.getSingleDocRef(contact.id);
      await updateDoc(contactRef, this.getCleanJson(contact)).catch(
        (err) => {
          console.error(err);
        }
      )
    }
  }

  getCleanJson(contact: Contact){
    return {
      name: contact.name,
      mail: contact.mail,
      phone: contact.phone,
      id: contact.id,
      active: true
    }
  }
}


