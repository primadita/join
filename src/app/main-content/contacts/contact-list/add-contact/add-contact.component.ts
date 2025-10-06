import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FirebaseServiceService } from '../../../../shared/services/firebase.service';
import { Contact } from '../../../../shared/interfaces/contact';
import { UserProfileImageService } from '../../../../shared/services/user-profile-image.service';

import { updateDoc } from '@angular/fire/firestore';
import { SelectContactService } from '../../../../shared/services/select-contact.service';

@Component({
  selector: 'app-add-contact',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-contact.component.html',
  styleUrl: './add-contact.component.scss'
})
export class AddContactComponent {

  userProfileBackground = inject(UserProfileImageService);

  selectService = inject(SelectContactService);

  contactData = {
    name: "",
    email: "",
    phone: ""
  };

  constructor(private contactService: FirebaseServiceService) {

  }

  @Output() getActive = new EventEmitter<boolean>()
  @Output() select = new EventEmitter<Contact>();

  contactList = inject(FirebaseServiceService);

  activeContact(contact: Contact) {

    this.select.emit(contact);
  }

  sendStatus() {
    this.getActive.emit();
  }

  addContact() {
    
    for (let i = 0; i < this.contactService.contactsList.length; i++) {

      this.contactList.contactsList[i].active = false;
    }

    let contact: Contact = {
      name: this.contactData.name,
      mail: this.contactData.email,
      phone: this.contactData.phone,
      id: '',
      active: false,
      bgColor: this.userProfileBackground.getBackgroundColor(this.getContactsLength())
    }
    this.contactService.addContact(contact).then(() => {
      const newContact = this.contactList.contactsList.find(c => {
        c.id === contact.id
      });
      console.log(newContact);
      
      newContact!.active = true;
    }

    );



    // const i = this.contactList.contactsList.length - 1;
    // this.contactList.contactsList[i].active = true;
    this.sendStatus();
    this.selectService.selectContact(contact);
    console.log(this.contactList.contactsList);

  }

  // TODO: hinzugefügter Kontakt muss auf lokal active gesetzt werden, damit er angezeigt wird 

  getContactsLength(): number {
    const arrayLength = this.contactService.contactsList.length
    return arrayLength + 1
  }
}
