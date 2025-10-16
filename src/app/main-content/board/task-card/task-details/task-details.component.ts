import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subtask, Task } from '../../../../shared/interfaces/task';
import { Contact } from '../../../../shared/interfaces/contact';
import { FirebaseServiceService } from '../../../../shared/services/firebase.service';
import { UserProfileImageService } from '../../../../shared/services/user-profile-image.service';
import {
  MAT_DATE_LOCALE,
  provideNativeDateAdapter,
} from '@angular/material/core';

@Component({
  selector: 'app-task-details',
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  ],
  imports: [CommonModule],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss',
})
export class TaskDetailsComponent {
  @Input() task!: Task;
  @Output() close = new EventEmitter<void>();

  constructor(
    private contactsSvc: FirebaseServiceService,
    private profilService: UserProfileImageService
  ) {}

  closing = false;

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
}
