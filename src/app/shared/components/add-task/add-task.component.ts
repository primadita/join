import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { FirebaseServiceService } from '../../services/firebase.service';
import { Contact } from '../../interfaces/contact';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule } from '@angular/forms';
import { Subtask, Task } from '../../interfaces/task';
import { TaskService } from '../../services/task.service';
import { RpSearchComponent } from './rp-search/rp-search.component';

@Component({
  selector: 'app-add-task',
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    FormsModule,
    RpSearchComponent
  ],

  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
})
export class AddTaskComponent {
  contacts = inject(FirebaseServiceService);
  taskService = inject(TaskService);

  newTask: Task = {
    id: '',
    title: '',
    description: '',
    date: new Date(),
    priority: null,
    assignedTo: [],
    category: 'User Story',
    subtasks: [],
    status: 'to do',
  };

  priorityFlag = {
    urgent: false,
    medium: false,
    low: false,
  };

  rpSearch: string = '';

  subtasks: Array<string> = ['Wäsche waschen', 'Fenster putzen'];

  singleSubtask: string = '';

  constructor(private el: ElementRef){}

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
      done: false,
    };
    this.newTask.subtasks.push(newSubtask);
    this.singleSubtask = '';
  }

  // #region prioritySetting
  setPriorityUrgent() {
    this.priorityFlag.urgent = !this.priorityFlag.urgent;
    this.priorityFlag.medium = false;
    this.priorityFlag.low = false;
    this.unsetPriority('urgent');

  }

  setPriorityMedium() {
    this.priorityFlag.medium = !this.priorityFlag.medium;

    this.priorityFlag.urgent = false;
    this.priorityFlag.low = false;
    this.unsetPriority('medium');

  }
  setPriorityLow() {
    this.priorityFlag.low = !this.priorityFlag.low;

    this.priorityFlag.urgent = false;
    this.priorityFlag.medium = false;
    this.unsetPriority('low');

  }

  unsetPriority(priority: 'urgent' | 'medium' | 'low') {
    if (priority == this.newTask.priority) {
      this.newTask.priority = null;
    } else {
      this.newTask.priority = priority;
    }
  }

  // #endregion


  addNewTask() {
    const newTask = this.newTask;
    console.log(newTask);
  }

  updateAssignedTo(array:Array<Contact>){
    this.newTask.assignedTo = array;
    console.log(this.newTask.assignedTo);
    
  }

  clearInputs() {
    this.newTask = {
      id: '',
      title: '',
      description: '',
      date: new Date(),
      priority: null,
      assignedTo: [],
      category: 'User Story',
      subtasks: [],
      status: 'to do',
    };

    this.priorityFlag = {
      urgent: false,
      medium: false,
      low: false,
    };
  }

  getThreeRP(): Contact[]{
      const array = this.newTask.assignedTo;
      const newArray = [array[0],array[1],array[2]]
      return newArray
  }

  valueRp(): number{
    return this.newTask.assignedTo.length - 3
  }

}
