import { Component, ElementRef, EventEmitter, HostListener, inject, Input, Output, signal, ViewChild } from '@angular/core';
import { FirebaseServiceService } from '../../services/firebase.service';
import { Contact } from '../../interfaces/contact';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { Category, Subtask, Task, TASK_CATEGORY, TASK_PRIORITY, TASK_STATUS } from '../../interfaces/task';
import { TaskService } from '../../services/task.service';
import { RpSearchComponent } from './rp-search/rp-search.component';
import { CategoryComponent } from './category/category.component';
import { ToastMessagesService } from '../../services/toast-messages.service';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { PatternValidatorDirective } from "../../directives/pattern-validator.directive";
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-add-task',
  standalone: true,
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
    DatePickerComponent,
    PatternValidatorDirective
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
  isLoading = false;
  categorySelected = true;
  actualDate = new Date();
  rpSearch: string = '';
  singleSubtask: string = '';
  showInvalidSubtaskWarning: boolean = false;
  invalidSubtaskMessage: string = '';
  editingIndex: number | null = null;
  @Output() clearTask = new EventEmitter<void>();
  @Output() createTask = new EventEmitter<Task>();
  @Output() taskCreated = new EventEmitter<void>();
  @Input() parentContext: 'board' | 'addtask' = 'addtask';
  @ViewChild(DatePickerComponent) datePickerComponent!: DatePickerComponent;

  // #endregion

  constructor(private el: ElementRef, private toastService: ToastMessagesService) { }

  // #region METHODS
  ngOnInit(){
    this.loadInputsFromSessionStorage();
  }

  loadInputsFromSessionStorage(){
    const savedData = sessionStorage.getItem('newTaskData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      this.newTask.title = parsed.title || '';
      this.newTask.description = parsed.description || '';
      const d = parsed.dueDate;
      if (d && typeof d === 'object' && 'seconds' in d) {
        // Firestore Timestamp-like object (nach JSON.stringify)
        this.newTask.date = new Date(d.seconds * 1000);
      } else {
        // normaler String
        this.newTask.date = d ? new Date(d) : null;
      }
      this.newTask.assignedTo = parsed.assignedTo || [];
      this.newTask.category = parsed.category || TASK_CATEGORY.DEFAULT;
      this.newTask.priority = parsed.priority || TASK_PRIORITY.MEDIUM;
      this.newTask.subtasks = parsed.subtasks || [];
    }
    this.priorityFlag = {
      urgent: this.newTask.priority === TASK_PRIORITY.URGENT,
      medium: this.newTask.priority === TASK_PRIORITY.MEDIUM,
      low: this.newTask.priority === TASK_PRIORITY.LOW
    }
  } 
  
  saveInputs(){
    const date = this.newTask.date;
    let dueDate = null;
    if (date instanceof Date) {
      dueDate = { seconds: Math.floor(date.getTime() / 1000), nanoseconds: 0 };
    } else if (date instanceof Timestamp) {
      dueDate = { seconds: date.seconds, nanoseconds: date.nanoseconds };
    }
    const dataToSave = {
    title: this.newTask.title,
    description: this.newTask.description,
    dueDate: date,
    assignedTo: this.newTask.assignedTo,
    category: this.newTask.category,
    priority: this.newTask.priority,
    subtasks: this.newTask.subtasks
  };
  sessionStorage.setItem('newTaskData', JSON.stringify(dataToSave));
  }

  get titleTooLong() {
    return this.newTask.title?.length > 30;
  }
  setDate(date: Date | null) {
    this.newTask.date = date;
    this.saveInputs();
  }

  setCategory(value: Category) {
    this.newTask.category = value;
    this.categorySelected = true;
    this.saveInputs();
  }

  sendForm(ngForm: NgForm, title: NgModel) {
    if (this.fullValidation(ngForm)) {
      this.isLoading = true;
      this.onCreateTask();
    }
    if (this.newTask.category == TASK_CATEGORY.DEFAULT) {
      this.categorySelected = false;
    }
    if (!ngForm.form.valid) {
      title.control.markAsTouched();
    }
    if ((this.newTask.date == null) || (this.newTask.date <= this.actualDate)) {
      this.datePickerComponent.markDateAsTouched();
    }
  }

  fullValidation(ngForm: NgForm) {
    return ngForm.form.valid &&
      this.newTask.date != null &&
      this.newTask.date >= this.actualDate &&
      this.newTask.category != TASK_CATEGORY.DEFAULT
  }

  onClearInputs(title: NgModel) {
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
    title.control.markAsUntouched();

    this.singleSubtask = "";
    this.categorySelected = true;
    this.clearTask.emit();
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
    sessionStorage.clear();
  }
  // #region METHODS of PRIORITY
  setPriorityUrgent() {
    this.priorityFlag.urgent = !this.priorityFlag.urgent;
    this.priorityFlag.medium = false;
    this.priorityFlag.low = false;
    this.unsetPriority('urgent');
    this.saveInputs();
  }

  setPriorityMedium() {
    this.priorityFlag.medium = !this.priorityFlag.medium;
    this.priorityFlag.urgent = false;
    this.priorityFlag.low = false;
    this.unsetPriority('medium');
    this.saveInputs();
  }

  setPriorityLow() {
    this.priorityFlag.low = !this.priorityFlag.low;
    this.priorityFlag.urgent = false;
    this.priorityFlag.medium = false;
    this.unsetPriority('low');
    this.saveInputs();
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
  updateAssignedContacts(updatedContacts: Contact[]) {
    this.newTask.assignedTo = updatedContacts;
    this.saveInputs(); // damit sessionStorage aktualisiert wird
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

  addRpToArray(contact: Contact) {
    const array = this.newTask.assignedTo;
    const test = array.includes(contact);
    if (!test) {
      array.push(contact);
    } else if (test) {
      const index = array.indexOf(contact);
      array.splice(index, 1);
    }
    this.saveInputs();
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
  addSubtask(subtask: NgModel) {
    this.showInvalidSubtaskWarning = true;
    this.invalidSubtaskMessage = '';
    const trimmedSubtask = this.singleSubtask.trim();
    const existedSubtask = this.newTask.subtasks.some( s => s.title.toLowerCase() === trimmedSubtask.toLowerCase());
    
    if(!trimmedSubtask){
      this.invalidSubtaskMessage = "Subtask cannot be empty.";
      this.showInvalidSubtaskWarning = true;
      return;
    }
    
    if(existedSubtask){
      this.invalidSubtaskMessage = "Subtask already exists.";
      this.showInvalidSubtaskWarning = true;
      return;
    }

    if (subtask.valid) {
      // const subtaskTitle = this.singleSubtask;
      const newSubtask: Subtask = {
        title: this.singleSubtask,
        done: false
      };
      this.newTask.subtasks.unshift(newSubtask);
      this.singleSubtask = '';
      this.showInvalidSubtaskWarning = false;
    } else{
      this.showInvalidSubtaskWarning = true;
      this.invalidSubtaskMessage ="Invalid subtask."
    }
    this.saveInputs();
  }

  clearSubtaskInput() {
    this.singleSubtask = "";
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
    const current = this.newTask.subtasks?.[i];
    if (!current) {
      this.editingIndex = null;
      return;
    }
    const trimmed = (current.title ?? '').trim();
    if (!trimmed) {
      // remove empty subtask instead of saving empty title
      this.newTask = {
        ...this.newTask,
        subtasks: this.newTask.subtasks.filter((_, idx) => idx !== i),
      };
    } else {
      this.newTask.subtasks[i] = { ...current, title: trimmed };
    }
    this.editingIndex = null;
  }


  isEditing(i: number): boolean {
    return this.editingIndex === i;
  }
  // #endregion
}
