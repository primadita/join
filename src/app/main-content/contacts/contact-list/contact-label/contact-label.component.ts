import { Component, inject } from '@angular/core';
import { FirebaseServiceService } from '../../../../shared/services/firebase.service';
import { Contact } from '../../../../shared/interfaces/contact';

@Component({
  selector: 'app-contact-label',
  imports: [],
  templateUrl: './contact-label.component.html',
  styleUrl: './contact-label.component.scss',
})
export class ContactLabelComponent {
  contactList = inject(FirebaseServiceService);

  getLetters(contact: Contact): string {
    const parts = contact.name.trim().split(' ');
    const initials = parts.map((user) => user.charAt(0).toUpperCase()).join('');
    return initials;
  }
}
