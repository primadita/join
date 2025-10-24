import { Component, ElementRef, EventEmitter, HostListener, inject, Input, Output, signal, ViewChild } from '@angular/core';
import { FirebaseServiceService } from '../../services/firebase.service';
import { Contact } from '../../interfaces/contact';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule } from '@angular/forms';
import { Category, Subtask, Task, TASK_CATEGORY, TASK_PRIORITY, TASK_STATUS } from '../../interfaces/task';
import { TaskService } from '../../services/task.service';
import { RpSearchComponent } from './rp-search/rp-search.component';
import { CategoryComponent } from './category/category.component';
import { ToastMessagesService } from '../../services/toast-messages.service';
import { DatePickerComponent } from './date-picker/date-picker.component';

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
    RpSearchComponent,
    CategoryComponent,
    DatePickerComponent
  ],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
})
export class AddTaskComponent {
  // #region ATTRIBUTES
  contacts = inject(FirebaseServiceService);
  taskService = inject(TaskService);
  newTask: Task = {
    id: '',
    title: '',
    description: '',
    date: null,
    priority: TASK_PRIORITY.MEDIUM,
    assignedTo: [],
    category: TASK_CATEGORY.DEFAULT,
    subtasks: [],
    status: TASK_STATUS.TO_DO,
  };
  priorityFlag = {
    urgent: false,
    medium: true,
    low: false,
  };
  categorySelected = true;
  actualDate = new Date();
  rpSearch: string = '';
  singleSubtask: string = '';
  editingIndex: number | null = null;
  @Output() clearTask = new EventEmitter<void>();
  @Output() createTask = new EventEmitter<Task>();
  @Output() taskCreated = new EventEmitter<void>();
  @Input() parentContext: 'board' | 'addtask' = 'addtask';
  @ViewChild(RpSearchComponent) rpSearchComponent!: RpSearchComponent;
  @ViewChild(DatePickerComponent) datePickerComponent!: DatePickerComponent;
  
  // #endregion

  constructor(private el: ElementRef, private toastService: ToastMessagesService) { }

  // #region METHODS
  get titleTooLong() {
    return this.newTask.title?.length >= 30;
  }
  setDate(date: Date | null) {
    this.newTask.date = date;
    console.log(this.newTask.date);
  }

  setCategory(value: Category) {
    this.newTask.category = value;
    console.log(this.newTask.category);
    this.categorySelected = true;
  }

  checkValidation() {
    if (this.newTask.date != null) {
      if (this.newTask.title.length >= 1 &&
        (this.newTask.date >= this.actualDate) &&
        this.newTask.category != TASK_CATEGORY.DEFAULT) {
        this.onCreateTask();
      }
    }
    else if (this.newTask.category == TASK_CATEGORY.DEFAULT) {

      console.log('Task konnte nicht erstellt werden');
      this.categorySelected = false;
    } else {
      console.log('Task konnte nicht erstellt werden');
    }
  }

  onClearInputs() {
    this.newTask = {
      id: '',
      title: '',
      description: '',
      date: null,
      priority: TASK_PRIORITY.MEDIUM,
      assignedTo: [],
      category: TASK_CATEGORY.DEFAULT,
      subtasks: [],
      status: TASK_STATUS.TO_DO,
    };
    this.priorityFlag = {
      urgent: false,
      medium: true,
      low: false,
    };
    this.clearTask.emit();
    this.rpSearchComponent.clearRpList();
    this.datePickerComponent.clearDate();
  }

  onCreateTask() {
    if (this.parentContext === 'addtask') {
      this.taskService.addTask(this.newTask);
      this.toastService.show('Task added to board', 'success', './assets/icons/board.svg');
      setTimeout(() => { this.taskCreated.emit() }, 3000);
    }

    if (this.parentContext === 'board') {
      this.createTask.emit(this.newTask);
      this.toastService.show('Task added to board', 'success', './assets/icons/board.svg');
    }
  }
  // #region METHODS of PRIORITY
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
      this.newTask.priority = TASK_PRIORITY.MEDIUM;
    } else {
      this.newTask.priority = priority;
    }
  }
  // #endregion
  // #region METHODS of ASSIGNED TO
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

  updateAssignedTo(array: Array<Contact>) {
    this.newTask.assignedTo = array;
  }

  getThreeRP(): Contact[] {
    const array = this.newTask.assignedTo;
    const newArray = [array[0], array[1], array[2]]
    return newArray
  }

  valueRp(): number {
    return this.newTask.assignedTo.length - 3
  }
  // #endregion
  // #region METHODS of SUBTASKS
  addSubtask() {
    if (this.singleSubtask.length > 0) {
      const subtaskTitle = this.singleSubtask;
      const newSubtask: Subtask = {
        title: subtaskTitle,
        done: false,
      };
      this.newTask.subtasks.push(newSubtask);
      this.singleSubtask = '';
    }
  }

  deleteSubtask(index: number) {
    const updated = this.newTask.subtasks.filter((_, i) => i !== index);
    this.newTask = { ...this.newTask, subtasks: updated };
    this.editingIndex = null;
  }

  editSubtask(i: number) {
    this.editingIndex = i;
  }

  saveSubtaskEdit(i: number) {
    this.editingIndex = null;
  }

  isEditing(i: number): boolean {
    return this.editingIndex === i;
  }
  // #endregion
  // #endregion
}
