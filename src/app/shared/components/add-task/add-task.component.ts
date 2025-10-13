import { Component, inject } from '@angular/core';
import { FirebaseServiceService } from '../../services/firebase.service';
import { Contact } from '../../interfaces/contact';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter, _MatInternalFormField } from '@angular/material/core';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

@Component({
  selector: 'app-add-task',
  providers: [provideNativeDateAdapter()],
  imports: [CommonModule, MatDatepickerModule, MatInputModule, MatFormFieldModule, MatAutocompleteModule, _MatInternalFormField],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent {

  contacts = inject(FirebaseServiceService);

  subtasks: Array<string> = ["Wäsche waschen", "Fenster putzen"]




  getLetters(contact: Contact): string {
    const parts = contact.name.trim().split(' ');
    const first = parts[0]?.[0] || '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    const initials = (first + last).toUpperCase();
    return initials;
  }

  /**
 * Returns an alphabetically sorted copy of the contact list.
 *
 * - Sorting is case-insensitive.
 * - The original data in the service remains unchanged (due to use of `slice()`).
 *
 * @returns {Contact[]} A new array containing contacts sorted by name.
 */
  sortedContacts(): Contact[] {
    return this.contacts.contactsList.slice().sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
  }

}
