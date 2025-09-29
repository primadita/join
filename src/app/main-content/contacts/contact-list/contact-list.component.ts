import { Component } from '@angular/core';
import { users } from '../../../shared/userData';
import { ContactLabelComponent } from './contact-label/contact-label.component';

@Component({
  selector: 'app-contact-list',
  imports: [ContactLabelComponent],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.scss',
})
export class ContactListComponent {}
