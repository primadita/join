import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { TaskCardComponent } from './task-card/task-card.component';
import { TaskDetailsComponent } from './task-card/task-details/task-details.component';
import { TaskService } from '../../shared/services/task.service';
import { Task } from '../../shared/interfaces/task';
import { map } from 'rxjs';

type Status = Task['status'];

const ListIdToStatus: Record<string, Status> = {
  toDoList: 'to do',
  inProgressList: 'in progress',
  awaitFeedbackList: 'await feedback',
  doneList: 'done',
};

interface BoardColumns {
  todo: Task[];
  inprogress: Task[];
  awaitfeedback: Task[];
  done: Task[];
}

@Component({
  selector: 'app-board',
  imports: [
    CommonModule,
    DragDropModule,
    TaskCardComponent,
    TaskDetailsComponent,
    CdkDropList,
    CdkDrag,
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  taskService = inject(TaskService);

  /*
    Ein Observable mit allen 4 Spalten
  */
  board$ = this.taskService.tasks$.pipe(
    map(
      (tasks) =>
        ({
          todo: tasks.filter((t) => t.status === 'to do'),
          inprogress: tasks.filter((t) => t.status === 'in progress'),
          awaitfeedback: tasks.filter((t) => t.status == 'await feedback'),
          done: tasks.filter((t) => t.status === 'done'),
        } as BoardColumns)
    )
  );

  selectedTask: Task | null = null;
  showDetail = false;

  // #region METHODS
  openTask(task: Task) {
    this.selectedTask = task;
    this.showDetail = true;
  }

  closeTask() {
    this.showDetail = false;
    this.selectedTask = null;
  }

  drop(event: CdkDragDrop<Task[]>) {
    // Lokales Array-Update (sofortiges visuelles Feedback)
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    //Welcher Task wurde bewegt?
    const movedTask = event.item.data as Task;

    // Ziel-Status aus Liste ableiten
    const newStatus = ListIdToStatus[event.container.id];
    if (!newStatus) return;

    // Nur speichern, wenn sich der Status wirklich geänder hat
    if (movedTask.status !== newStatus) {
      const updated: Task = { ...movedTask, status: newStatus };
      this.taskService.updateTask(updated);
      // Firestore-Update triggert automatisch neue Werte in board$ -> UI ist konsistent
    }
  }
}
