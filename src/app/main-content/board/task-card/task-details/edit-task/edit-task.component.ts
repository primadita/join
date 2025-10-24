import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  Category,
  Priority,
  Subtask,
  Task,
  TASK_CATEGORY,
  TASK_PRIORITY,
  TASK_STATUS,
} from '../../../../../shared/interfaces/task';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RpSearchComponent } from '../../../../../shared/components/add-task/rp-search/rp-search.component';
import { Contact } from '../../../../../shared/interfaces/contact';
import { CommonModule } from '@angular/common';
import { FirebaseServiceService } from '../../../../../shared/services/firebase.service';
import { TaskService } from '../../../../../shared/services/task.service';
import { UserProfileImageService } from '../../../../../shared/services/user-profile-image.service';
import { FormsModule } from '@angular/forms';
import { Timestamp } from '@angular/fire/firestore';
import {
  MAT_DATE_LOCALE,
  MatNativeDateModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-edit-task',
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' },
  ],
  imports: [
    MatDatepickerModule,
    RpSearchComponent,
    CommonModule,
    FormsModule,
    MatNativeDateModule,
    MatInputModule,
  ],
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.scss',
})
export class EditTaskComponent {
  @Input() task!: Task;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<string>();

  isOpen: boolean = true;

  priorityFlag = {
    urgent: false,
    medium: false,
    low: false,
  };
  protected readonly TASK_PRIORITY = TASK_PRIORITY;

  singleSubtask: string = '';
  dueDate: Date | null = null;
  actualDate = new Date();

  constructor(
    private taskSvc: TaskService,
    private contactsSvc: FirebaseServiceService,
    private profilService: UserProfileImageService
  ) {}

  onOverlayClick() {
    this.isOpen = false;
  }

  onContentClick(ev: MouseEvent, rpSearch: RpSearchComponent) {
    const host = rpSearch?.el?.nativeElement as HTMLElement | undefined;
    if (host && host.contains(ev.target as Node)) {
      ev.stopPropagation();
      return;
    }
    rpSearch?.closeList();
    ev.stopPropagation();
  }

  setPriority(p: Priority) {
    this.task = { ...this.task, priority: p };
  }

  addSubtask() {
    const title = this.singleSubtask.trim();
    if (!title) return;

    const newSubtask: Subtask = {
      title,
      done: false,
    };

    const updatedSubtasks = [...(this.task.subtasks || []), newSubtask];
    this.task = { ...this.task, subtasks: updatedSubtasks };

    this.singleSubtask = '';
  }

  clearSubtaskInput() {
    this.singleSubtask = '';
  }

  assignedIds() {
    const assignedId = this.task.assignedTo;
    return assignedId.map((x) => {
      if ('id' in x) return String(x.id);
      return '';
    });
  }

  get assignedToContacts(): Contact[] {
    const ids = new Set(this.assignedIds());
    return this.contactsSvc.contactsList.filter((c) => ids.has(c.id));
  }

  get subtasks(): Subtask[] {
    return this.task.subtasks;
  }

  initialsOf(c: Contact) {
    return this.profilService.createInitial(c.name);
  }

  bgColorOf(c: Contact) {
    return c.bgColor;
  }

  ngOnChanges() {
    // Task -> Form
    this.dueDate = this.toDate(this.task?.date) ?? null;
  }

  private toDate(d: any): Date | null {
    if (!d) return null;
    // ist bereits ein Date von Datepicker oder
    if (d instanceof Date) return d;
    if (typeof d?.toDate === 'function') return d.toDate();
    return new Date(d);
  }
  private fromDate(d: Date | null): any {
    return d ? Timestamp.fromDate(d) : null;
  }

  // #region prioritySetting
  setPriorityUrgent() {
    this.priorityFlag.urgent = !this.priorityFlag.urgent;
    this.priorityFlag.medium = false;
    this.priorityFlag.low = false;
  }

  setPriorityMedium() {
    this.priorityFlag.medium = !this.priorityFlag.medium;

    this.priorityFlag.urgent = false;
    this.priorityFlag.low = false;
  }
  setPriorityLow() {
    this.priorityFlag.low = !this.priorityFlag.low;

    this.priorityFlag.urgent = false;
    this.priorityFlag.medium = false;
  }

  // #endregion

  onSubmit() {
    this.dateError = null;

    // 1) Muss ein valides Date sein
    if (!this.isValidDate(this.dueDate)) {
      this.dateError = 'invalid';
      return; // nichts tun
    }

    // 2) Muss strikt in der Zukunft liegen (heute zählt nicht)
    if (!this.isInFuture(this.dueDate)) {
      this.dateError = 'pastOrToday';
      return; // nichts tun
    }

    // 3) OK → speichern
    const updated: Task = {
      ...this.task,
      date: Timestamp.fromDate(this.dueDate),
    };
    this.save.emit(updated);
  }

  onCancel() {
    this.close.emit();
  }

  onAssignedChange(selectedContacts: Contact[]) {
    const current = this.task.assignedTo || [];
    const incoming = selectedContacts || [];
    const byId = new Map<string, Contact>();
    for (const c of current) byId.set(c.id, c);
    for (const c of incoming) byId.set(c.id, c);
    const updatedContacts = Array.from(byId.values());
    this.task = { ...this.task, assignedTo: updatedContacts };
  }

    addRpToArray(contact: Contact) {
    const array = this.task.assignedTo;
    const test = array.includes(contact);
    if (!test) {
      array.push(contact);
    } else if (test) {
      const index = array.indexOf(contact);
      array.splice(index, 1);
    }
  }

  deleteSubtask(index: number) {
    const updated = this.task.subtasks.filter((_, i) => i !== index);
    this.task = { ...this.task, subtasks: updated };
    this.editingIndex = null;
  }

  editingIndex: number | null = null;

  editSubtask(i: number) {
    this.editingIndex = i;
  }

  saveSubtaskEdit(i: number) {
    this.editingIndex = null;
  }

  isEditing(i: number): boolean {
    return this.editingIndex === i;
  }

  // Eingegebene Datum überprüfen vor dem Submit

  dateError: 'invalid' | 'pastOrToday' | null = null;

  // prüft ob der parameter ein wirkliches Date-Objekt ist
  private isValidDate(d: any): d is Date {
    //ist der paramter
    return d instanceof Date && !isNaN(d.getTime());
  }

  private isInFuture(date: Date): boolean {
    const picked = new Date(date);
    const today = new Date();
    return picked.getTime() > today.getTime();
  }
}
