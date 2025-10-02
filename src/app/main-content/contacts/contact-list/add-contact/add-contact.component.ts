import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FirebaseServiceService } from '../../../../shared/services/firebase.service';
import { Contact } from '../../../../shared/interfaces/contact';
import { UserProfileImageService } from '../../../../shared/services/user-profile-image.service';
import { update } from '@angular/fire/database';
import { updateDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-add-contact',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-contact.component.html',
  styleUrl: './add-contact.component.scss'
})
export class AddContactComponent {

  userProfileBackground = inject(UserProfileImageService);

    contactData = {
    name: "",
    email: "",
    phone: ""
  };

  constructor(private contactService: FirebaseServiceService){

  }

  @Output() getActive = new EventEmitter<boolean>()

  sendStatus(){
    this.getActive.emit();
  }

  async addContact(){

    for (let i = 0; i < this.contactService.contactsList.length; i++) {
      const contactId = this.contactService.contactsList[i].id;
      const contactRef = this.contactService.getSingleDocRef(contactId);
      await updateDoc(contactRef, {active: false});      
    }

    let contact: Contact = {
      name: this.contactData.name,
      mail: this.contactData.email,
      phone: this.contactData.phone,
      id: '',
      active: true,
      bgColor: this.userProfileBackground.getBackgroundColor(this.getContactsLength()) 
    }
    this.contactService.addContact(contact);
    this.sendStatus();
  }

  getContactsLength(): number{
    const arrayLength = this.contactService.contactsList.length
      return arrayLength + 1
  }


}
