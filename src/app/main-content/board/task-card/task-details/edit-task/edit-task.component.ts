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
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-edit-task',
  imports: [
    MatDatepickerModule,
    RpSearchComponent,
    CommonModule,
    FormsModule,
    MatNativeDateModule,
  ],
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.scss',
})
export class EditTaskComponent {
  @Input() task!: Task;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Task>();

  priorityFlag = {
    urgent: false,
    medium: false,
    low: false,
  };
  protected readonly TASK_PRIORITY = TASK_PRIORITY;

  singleSubtask: string = '';
  dueDate: Date | null = null;

  constructor(
    private taskSvc: TaskService,
    private contactsSvc: FirebaseServiceService,
    private profilService: UserProfileImageService
  ) {}

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
    const updated: Task = { ...this.task, date: this.fromDate(this.dueDate) };
    this.save.emit(updated);
  }

  onCancel() {
    this.close.emit();
  }
}
