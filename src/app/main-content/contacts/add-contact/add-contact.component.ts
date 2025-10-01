import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-contact',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-contact.component.html',
  styleUrl: './add-contact.component.scss'
})
export class AddContactComponent {

    contactData = {
    name: "",
    email: "",
    phone: ""
  };

  active:boolean = false;

  toggleAddContact():void {
    this.active = !this.active;
  }

}
