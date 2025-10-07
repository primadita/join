import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { FirebaseServiceService } from '../../../../shared/services/firebase.service';
import { Contact } from '../../../../shared/interfaces/contact';
import { UserProfileImageService } from '../../../../shared/services/user-profile-image.service';

import { updateDoc } from '@angular/fire/firestore';
import { SelectContactService } from '../../../../shared/services/select-contact.service';
import { ToastMessagesService } from '../../../../shared/services/toast-messages.service';

@Component({
  selector: 'app-add-contact',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-contact.component.html',
  styleUrl: './add-contact.component.scss',
})
export class AddContactComponent {
  userProfileBackground = inject(UserProfileImageService);

  selectService = inject(SelectContactService);

  contactData = {
    name: '',
    email: '',
    phone: '',
  };

  loadingActive: boolean = false;

  constructor(private contactService: FirebaseServiceService, private toastMessage: ToastMessagesService) { }

  @Output() getActive = new EventEmitter<boolean>();
  @Output() select = new EventEmitter<Contact>();

  contactList = inject(FirebaseServiceService);

  activeContact(contact: Contact) {
    this.select.emit(contact);
  }

  sendStatus() {
    this.getActive.emit();
  }

  async addContact() {
    this.toggleLoadingScreen();
    const contact = this.createContact();
    const newContactId = await this.contactService.addContact(contact);
    await Promise.all(
      this.contactService.contactsList
        .filter((c) => c.id && c.id !== newContactId)
        .map((c) =>
          updateDoc(this.contactService.getSingleDocRef(c.id!), {
            active: false,
          })
        )
    );
    this.closePopUp(contact);
  }

  createContact() {
    let contact: Contact = {
      name: this.contactData.name,
      mail: this.contactData.email,
      phone: this.contactData.phone,
      id: '',
      active: true,
      bgColor: this.userProfileBackground.getBackgroundColor(
        this.getContactsLength()
      ),
    };
    return contact;
  }

  deactivateContacts() {
    for (let i = 0; i < this.contactService.contactsList.length; i++) {
      this.contactList.contactsList[i].active = false;
    }
  }

  onSubmit(ngForm: NgForm) {
    if (ngForm.valid && ngForm.submitted) {
      this.addContact();
    }
  }

  toggleLoadingScreen() {
    this.loadingActive = !this.loadingActive;
  }

  closePopUp(contact: Contact) {
    this.sendStatus();
    this.selectService.selectContact(contact);
    this.toggleLoadingScreen();
    if (window.innerWidth < 640){
      this.toastMessage.show("Contact successfully created", "success");
    } else {
    this.toastMessage.show("Contact has been succesfully created", "success");
    }
  }

  // TODO: hinzugefügter Kontakt muss auf lokal active gesetzt werden, damit er angezeigt wird

  getContactsLength(): number {
    const arrayLength = this.contactService.contactsList.length;
    return arrayLength + 1;
  }
}
