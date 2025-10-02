import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserProfileImageComponent } from '../../../shared/components/user-profile-image/user-profile-image.component';
import { Contact } from '../../../shared/interfaces/contact';
import { FirebaseServiceService } from '../../../shared/services/firebase.service';

@Component({
  selector: 'app-edit-contact',
  imports: [CommonModule, FormsModule, UserProfileImageComponent],
  templateUrl: './edit-contact.component.html',
  styleUrl: './edit-contact.component.scss'
})
export class EditContactComponent {
  @Output() close = new EventEmitter<boolean>();
  @Output() save = new EventEmitter();
  @Input() contactDetails!: Contact;
  contactService = inject(FirebaseServiceService);

  contactData = {
    name: "",
    mail: "",
    phone: ""
  }

  ngOnInit(){
    if(this.contactDetails){
      this.contactData = {
        name: this.contactDetails.name,
        mail: this.contactDetails.mail,
        phone: this.contactDetails.phone
      }
    }
  }
  
  closeEditWindow(){
    this.close.emit();
  }

  sendSaveInput(){
    this.save.emit(this.contactData);
  }

  
}
