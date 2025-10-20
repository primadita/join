import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  Category,
  Subtask,
  Task,
  TASK_CATEGORY,
} from '../../../../shared/interfaces/task';
import { Contact } from '../../../../shared/interfaces/contact';
import { FirebaseServiceService } from '../../../../shared/services/firebase.service';
import { UserProfileImageService } from '../../../../shared/services/user-profile-image.service';
import {
  MAT_DATE_LOCALE,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { Timestamp } from '@angular/fire/firestore';
import { TaskService } from '../../../../shared/services/task.service';

@Component({
  selector: 'app-task-details',
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  ],
  imports: [CommonModule, DatePipe],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss',
})
export class TaskDetailsComponent {
  @Input() task!: Task;
  @Output() close = new EventEmitter<void>();

  constructor(
    private taskSvc: TaskService,
    private contactsSvc: FirebaseServiceService,
    private profilService: UserProfileImageService
  ) {}

  closing = false;

  getCategoryColor(task: Task) {
    if (task.category === TASK_CATEGORY.USER_STORY) {
      return '#0038ff';
    }
    if (task.category === TASK_CATEGORY.TECHNICAL_TASK) {
      return '#1fd7c1';
    }
    return '#ffffff';
  }

  getdate(date: any) {
    const newDate = (date as Timestamp).toDate();
    return newDate;
  }

  onClose() {
    this.closing = true;
    setTimeout(() => this.close.emit(), 220);
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

  initialsOf(c: Contact) {
    return this.profilService.createInitial(c.name);
  }

  bgColorOf(c: Contact) {
    return c.bgColor;
  }

  get subtasks(): Subtask[] {
    return this.task.subtasks;
  }

  onToggleSubtask(index: number, checked: boolean) {
    const updatedSubtasks = this.task.subtasks.map((subt, i) => {
      if (i === index) {
        return { ...subt, done: checked };
      }
      return subt;
    });

    const updatedTask = { ...this.task, subtasks: updatedSubtasks };

    this.task = updatedTask;
    this.taskSvc.updateTask(updatedTask);
  }
}
