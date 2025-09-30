import { Component, inject } from '@angular/core';
import { users } from '../../../shared/userData';
import { ContactLabelComponent } from './contact-label/contact-label.component';
import { FirebaseServiceService } from '../../../shared/services/firebase.service';

@Component({
  selector: 'app-contact-list',
  imports: [ContactLabelComponent],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.scss',
})
export class ContactListComponent {
  contactList = inject(FirebaseServiceService);

  constructor() {}
}
