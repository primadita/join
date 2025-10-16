import { Component, inject } from '@angular/core';
import { FirebaseServiceService } from '../../services/firebase.service';
import { Contact } from '../../interfaces/contact';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter, _MatInternalFormField } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule } from "@angular/forms";
import { Subtask, Task } from '../../interfaces/task';


@Component({
  selector: 'app-add-task',
  providers: [provideNativeDateAdapter()],
  imports: [CommonModule, MatDatepickerModule, MatInputModule, MatFormFieldModule, MatAutocompleteModule, _MatInternalFormField, FormsModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent {

  contacts = inject(FirebaseServiceService);

  newTask: Task = {
    id: '',
    title: '',
    description: '',
    date: "",
    priority: null,
    assignedTo: [],
    category: 'User Story',
    subtasks: [],
    status: 'to do'
  };

  priorityFlag = {
    urgent: false,
    medium: false,
    low: false
  }

  rpSearch: string = "";


  subtasks: Array<string> = ["Wäsche waschen", "Fenster putzen"];

  singleSubtask: string = ""


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

  addSubtask() {
    const subtaskTitle = this.singleSubtask;
    const newSubtask: Subtask = {
      title: subtaskTitle,
      done: false
    }
    this.newTask.subtasks.push(newSubtask);
    this.singleSubtask = "";
  }

  // #region prioritySetting
  setPriorityUrgent() {
    this.priorityFlag.urgent = !this.priorityFlag.urgent;
    console.log(this.priorityFlag.urgent);
  }
  setPrioritymedium() {
    this.priorityFlag.medium = !this.priorityFlag.medium;
    console.log(this.priorityFlag.medium);
  }
  setPriorityLow() {
    this.priorityFlag.low = !this.priorityFlag.low;
    console.log(this.priorityFlag.low);
  }

  // #endregion

  getPriority() {
    if (this.priorityFlag.urgent) {
      return "urgent"
    }
    if (this.priorityFlag.medium) {
      return "medium"
    }
    if (this.priorityFlag.low) {
      return "low"
    } else {
      return null
    }
  }

  addNewTask() {
    const newTask = this.newTask;
    console.log(newTask);
  }

  addRpToArray(contact: Contact) {
    const array = this.newTask.assignedTo
    const test = array.includes(contact)
    if (!test) {
      array.push(contact);
      console.log(array);
    }else if(test){
      const index = array.indexOf(contact);
      array.splice(index, 1);
      console.log(array);
    }
  }



}
