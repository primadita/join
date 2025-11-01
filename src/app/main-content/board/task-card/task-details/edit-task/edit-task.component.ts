import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Category, Subtask, Task } from '../../../../../shared/interfaces/task';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RpSearchComponent } from '../../../../../shared/components/add-task/rp-search/rp-search.component';
import { Contact } from '../../../../../shared/interfaces/contact';
import { CommonModule } from '@angular/common';
import { FirebaseServiceService } from '../../../../../shared/services/firebase.service';

import { FormsModule } from '@angular/forms';
import { Timestamp } from '@angular/fire/firestore';
import {
  MAT_DATE_LOCALE,
  MatNativeDateModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { ToastMessagesService } from '../../../../../shared/services/toast-messages.service';
import { ToastMessageComponent } from '../../../../../shared/components/toast-message/toast-message.component';
import { take } from 'rxjs';
import { CategoryComponent } from '../../../../../shared/components/add-task/category/category.component';

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
    CategoryComponent
  ],
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.scss',
})
export class EditTaskComponent {
  // Task-Daten Original
  @Input() task!: Task;
  // Lokale, editierbare Kopie des Tasks
  localTask!: Task;
  categorySelected = true;
  //Outputs an Parent
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<string>();

  //Overlay-Visibility
  isOpen: boolean = true;

  /** Subtask eingabe */
  singleSubtask: string = '';
  /**Termin als Date-Objekt für den Datepicker */
  dueDate: Date | null = null;
  actualDate = new Date();

  constructor(
    private contactsSvc: FirebaseServiceService,
    private toastService: ToastMessagesService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['task'] && this.task) {
      this.localTask = this.deepCloneTask(this.task);

      const index = new Map(
        this.contactsSvc.contactsList.map((c) => [c.id, c])
      );
      this.localTask.assignedTo = (this.localTask.assignedTo ?? []).map(
        (c) => index.get(c.id) ?? c
      );

      this.dueDate = this.toDate(this.task?.date) ?? null;
    }
  }

  /**
   * _____________________________________________________
   * UI Methoden
   * _____________________________________________________
   */

  // Overlay clicks no longer close the dialog; only the close button does.

  onContentClick(ev: MouseEvent, rpSearch: RpSearchComponent) {
    const host = rpSearch?.el?.nativeElement as HTMLElement | undefined;
    if (host && host.contains(ev.target as Node)) {
      ev.stopPropagation();
      return;
    }
    rpSearch?.closeList();
    ev.stopPropagation();
  }

  /**
   * _____________________________________________________
   * Helper methoden
   * _____________________________________________________
   */

  private deepCloneTask(t: Task): Task {
    return {
      ...t,
      assignedTo: t.assignedTo
        ? t.assignedTo.map((contact) => ({ ...contact }))
        : [],
      subtasks: t.subtasks ? t.subtasks.map((subT) => ({ ...subT })) : [],
    };
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

  private isFutureDate(d: Date | null): boolean {
    if (!d) return false;
    const picked = new Date(d);
    const today = new Date();
    return picked.getTime() > today.getTime();
  }

  /**
   * _____________________________________________________
   * Getter Methoden für HTML
   * _____________________________________________________
   */

  get subtasks(): Subtask[] {
    return this.localTask.subtasks;
  }

  get titleTooLong() {
    return (this.localTask?.title?.length ?? 0) > 30;
  }

  /**
   * _____________________________________________________
   * Submit, Cancel, Delete
   * _____________________________________________________
   */

  onSubmit() {
    // solang das datum nicht in der zukunft liegt wird onSubmit nicht ausgeführt
    if (!this.isFutureDate(this.dueDate)) {
      return;
    }

    // sauberes subtask-array ohne leere subtasks
    const cleanedSubtasks: Subtask[] = [];
    // alle bestehenden subtasks
    const subtasks = this.localTask.subtasks || [];

    for (const subtask of subtasks) {
      // entferne leerzeichen am anfang und ende jeden subtasks
      const trimmedTitle = subtask.title.trim();

      // fügt nur subtasks ins saubere subtask-array hinzu wenn es nicht leer ist
      if (trimmedTitle.length > 0) {
        cleanedSubtasks.push({ ...subtask, title: trimmedTitle });
      }
    }

    const updated: Task = {
      ...this.task,

      title: this.localTask.title?.trim(),
      description: this.localTask.description?.trim(),
      category: this.localTask.category,
      priority: this.localTask.priority,
      assignedTo: this.localTask.assignedTo.map((c) => ({ ...c })),
      subtasks: cleanedSubtasks,
      date: this.fromDate(this.dueDate),
    };

    this.save.emit(updated);

    if(this.hasChanges()){
      this.toastService.show('Task changed', 'success');
    }
    
  }

  private hasChanges(): boolean {
    if(this.task.title !== this.localTask.title) return true;
    if(this.task.description !== this.localTask.description) return true;
    if(this.task.category !== this.localTask.category) return true;
    if(this.task.priority !== this.localTask.priority) return true;

    const originalDate = this.toDate(this.task.date);
    if(originalDate?.getTime() !== this.dueDate?.getTime()) return true;

    const originalAssignees = (this.task.assignedTo ?? []).map( c => c.id).sort();
    const localAssignees = (this.localTask.assignedTo ?? []).map( c => c.id).sort();
    if(JSON.stringify(originalAssignees) !== JSON.stringify(localAssignees)) return true;

    const originalSubtasks = (this.task.subtasks ?? []).map(s => ({title: s.title.trim(), done: s.done }));
    const localSubtasks = (this.localTask.subtasks ?? []).map(s => ({title: s.title.trim(), done: s.done}));
    if(JSON.stringify(originalSubtasks) !== JSON.stringify(localSubtasks)) return true;

    return false;
  }

  onCancel() {
    if(this.hasChanges()){
      this.toastService.show('Discard changes', 'success');
    }
    
    this.close.emit();
    
  }

  onDelete() {
    this.delete.emit(this.task.id);
  }

  /**
   * _____________________________________________________
   * Priority
   * _____________________________________________________
   */

  setPriority(p: Task['priority']) {
    this.localTask.priority = p;
  }

  isPriority(p: Task['priority']): boolean {
    return this.localTask?.priority === p;
  }

  /**
   * _____________________________________________________
   * Assigned-to vom child kommend
   * _____________________________________________________
   */

  addRpToArray(contact: Contact) {
    const exists = (this.localTask.assignedTo ?? []).some(
      (c) => c.id === contact.id
    );
    this.localTask = {
      ...this.localTask,
      assignedTo: exists
        ? this.localTask.assignedTo.filter((c) => c.id !== contact.id)
        : [...(this.localTask.assignedTo ?? []), contact],
    };
  }

  /**
   * _____________________________________________________
   * Category
   * _____________________________________________________
   */
  setCategory(value: Category) {
    this.localTask.category = value;
    this.categorySelected = true;
  }

  /**
   * _____________________________________________________
   * Subtasks
   * _____________________________________________________
   */

  clearSubtaskInput() {
    this.singleSubtask = '';
  }

  addSubtask(title?: string) {
    const t = (title ?? this.singleSubtask).trim();
    if (!t) return;
    this.localTask = {
      ...this.localTask,
      subtasks: [...(this.localTask.subtasks ?? []), { title: t, done: false }],
    };
    this.singleSubtask = '';
  }

  editSubtask(i: number) {
    this.editingIndex = i;
  }

  deleteSubtask(index: number) {
    this.localTask = {
      ...this.localTask,
      subtasks: this.subtasks.filter((_, i) => i !== index),
    };
    this.editingIndex = null;
  }

  editingIndex: number | null = null;

  saveSubtaskEdit(i: number) {
    const current = this.localTask.subtasks?.[i];
    if (!current) {
      this.editingIndex = null;
      return;
    }
    const trimmed = (current.title ?? '').trim();
    if (!trimmed) {
      // remove empty subtask instead of saving empty title
      this.localTask = {
        ...this.localTask,
        subtasks: this.localTask.subtasks.filter((_, idx) => idx !== i),
      };
    } else {
      this.localTask.subtasks[i] = { ...current, title: trimmed };
    }
    this.editingIndex = null;
  }

  isEditing(i: number): boolean {
    return this.editingIndex === i;
  }

  /**
   * _____________________________________________________
   * UI kleinkram
   * _____________________________________________________
   */

  getLetters(contact: Contact): string {
    const parts = contact.name.trim().split(' ');
    const first = parts[0]?.[0] || '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    const initials = (first + last).toUpperCase();
    return initials;
  }
}
