import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop' ;
import { TaskCardComponent } from './task-card/task-card.component';
import { TaskDetailsComponent } from './task-card/task-details/task-details.component';
import { TaskService } from '../../shared/services/task.service';
import { Task } from '../../shared/interfaces/task';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-board',
  imports: [CommonModule, DragDropModule, TaskCardComponent, TaskDetailsComponent, CdkDropList, CdkDrag],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  // #region ATTRIBUTES
  showDetail = false;
  taskService = inject(TaskService);
  cdr = inject(ChangeDetectorRef);
  // #endregion

  // #region METHODS
  openTask() {
    this.showDetail = true;
  }

  closeTask() {
    this.showDetail = false;
  }

  drop(event: CdkDragDrop<Task[]>){
    if(event.previousContainer === event.container){
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }else{
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }

    const movedTask = event.container.data[event.currentIndex];
    if(event.container.id === "toDoList"){
      movedTask.status = "to do"
    }
    if(event.container.id === "inProgressList"){
      movedTask.status = "in progress"
    }
    if(event.container.id === "awaitFeedbackList"){
      movedTask.status = "await feedback"
    }
    if(event.container.id === "doneList"){
      movedTask.status = "done"
    }
    this.taskService.updateTask(movedTask);
    this.cdr.detectChanges();
  }

  getTasksList(): Task[]{
    return this.taskService.tasksList;
  }

  getTasksListByStatus(status:string): Task[]{
    return this.getTasksList().filter(arr => arr.status === status);
  }
  
  getToDoList(): Task[]{
    return this.getTasksListByStatus("to do");
  }
  
  getInProgressList(): Task[]{
    return this.getTasksListByStatus("in progress");
  }

  getAwaitFeedbackList(): Task[]{
    return this.getTasksListByStatus("await feedback");
  }
  getDoneList(): Task[] {
    return this.getTasksListByStatus("done");
  }
  // getLength(status: string): number{
  //   const taskByStatus = this.getTasksListByStatus(status);
  //   return taskByStatus.length;
  // }
  // #endregion
}
