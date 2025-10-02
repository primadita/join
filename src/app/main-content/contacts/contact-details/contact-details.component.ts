import { CommonModule } from '@angular/common';
import { Component, inject} from '@angular/core';
import { SectionTitleVLineComponent } from '../../../shared/components/section-title-vline/section-title-vline.component';
import { UserProfileImageComponent } from '../../../shared/components/user-profile-image/user-profile-image.component';
import { SectionHeaderService } from '../../../shared/services/section-header.service';
import { FirebaseServiceService } from '../../../shared/services/firebase.service';
import { UserProfileImageService } from '../../../shared/services/user-profile-image.service';
import { Contact } from '../../../shared/interfaces/contact';
import { FormsModule } from '@angular/forms';
import { EditContactComponent } from '../edit-contact/edit-contact.component';
import { update } from '@angular/fire/database';

@Component({
  selector: 'app-contact-details',
  imports: [CommonModule, SectionTitleVLineComponent, EditContactComponent, UserProfileImageComponent, FormsModule],
  templateUrl: './contact-details.component.html',
  styleUrl: './contact-details.component.scss'
})
export class ContactDetailsComponent {
  // #region ATTRIBUTES
  sectionHeaderList = inject(SectionHeaderService);
  contacts = this.sectionHeaderList.sectionHeader.find(e => e.title === 'Contacts');

  contactFirebase = inject(FirebaseServiceService);
  userProfileService = inject(UserProfileImageService);
  edit:boolean = false;
  selectedContact!:Contact;

  // #endregion

  // #region METHODS
  toggleEditContactWindow(contact?: Contact){
    if(contact){
      this.selectedContact = contact;
    }
    this.edit= !this.edit;
  }

  deleteContact(id:string){
    this.contactFirebase.deleteContact(id);
  }
  
  saveContact(updatedData: Partial<Contact>){
    this.selectedContact = {
      id: this.selectedContact.id,
      name: updatedData.name || this.selectedContact.name,
      mail: updatedData.mail || this.selectedContact.mail,
      phone: updatedData.phone || this.selectedContact.phone,
      active: this.selectedContact.active
    } 
    this.contactFirebase.updateContact(this.selectedContact);
    this.edit = !this.edit;
  }
  
  // #endregion
}
