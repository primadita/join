import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-contact',
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-contact.component.html',
  styleUrl: './edit-contact.component.scss'
})
export class EditContactComponent {
  @Output() close = new EventEmitter<boolean>();

  contactData = {
    name: "",
    email: "",
    phone: ""
  }
  
  closeEditWindow(){
    this.close.emit();
  }
}
