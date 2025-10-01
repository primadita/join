import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FirebaseServiceService } from '../../../../shared/services/firebase.service';
import { Contact } from '../../../../shared/interfaces/contact';
import { UserProfileImageService } from '../../../../shared/services/user-profile-image.service';

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

  addContact(){
    let contact: Contact = {
      name: this.contactData.name,
      mail: this.contactData.email,
      phone: this.contactData.phone,
      id: '',
      active: false,
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
