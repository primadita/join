import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { Task, TASK_CATEGORY } from '../../../shared/interfaces/task';
import { CommonModule } from '@angular/common';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { Contact } from '../../../shared/interfaces/contact';
import { UserProfileImageService } from '../../../shared/services/user-profile-image.service';
import { doc, docData, DocumentReference } from '@angular/fire/firestore';
import { FirebaseServiceService } from '../../../shared/services/firebase.service';

@Component({
  selector: 'app-task-card',
  imports: [CommonModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
})
export class TaskCardComponent {
  @Input() task!: Task;
  @Output() openTask = new EventEmitter<Task>();

  constructor(
    private contactService: FirebaseServiceService,
    public profilService: UserProfileImageService
  ) {}

  onClick() {
    this.openTask.emit(this.task);
  }

  assignedIds() {
    const a = this.task.assignedTo;
    return a.map((x) => {
      if ('id' in x) return String(x.id);
      return '';
    });
  }

  get contacts(): Contact[] {
    const ids = new Set(this.assignedIds());
    return this.contactService.contactsList.filter((c) => ids.has(c.id));
  }

  get completedSubtasks() {
    return this.task.subtasks.filter((s) => s.done).length;
  }
  get totalSubtasks() {
    return this.task.subtasks.length;
  }

  get assignedToContacts() {
    const assignedValue = Math.max(this.task.assignedTo.length - 3, 0);
    return assignedValue;
  }
  initialsOf(c: Contact) {
    return this.profilService.createInitial(c.name);
  }

  bgColorOf(c: Contact) {
    return c.bgColor;
  }

  getCategoryColor(task: Task) {
    if (task.category === TASK_CATEGORY.USER_STORY) {
      return '#0038ff';
    }
    if (task.category === TASK_CATEGORY.TECHNICAL_TASK) {
      return '#1fd7c1';
    }
    return '#ffffff';
  }
}
