import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop' ;
import { TaskCardComponent } from './task-card/task-card.component';
import { TaskDetailsComponent } from './task-card/task-details/task-details.component';
import { TaskService } from '../../shared/services/task.service';
import { Task } from '../../shared/interfaces/task';

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
  todo:Task[] = [];
  inprogress:Task[] = [];
  awaitfeedback: Task[] =  [];
  done:Task[] = [];
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
  }

  getTasksList(): Task[]{
    // console.log(this.taskService.tasksList);
    return this.taskService.tasksList;
  }

  getTasksListByStatus(status:string): Task[]{
    return this.getTasksList().filter(arr => arr.status === status);
  }
  
  getToDoList(): Task[]{
    this.todo = this.getTasksListByStatus("to do");
    return this.todo;
  }
  
  getInProgressList(): Task[]{
    this.inprogress = this.getTasksListByStatus("in progress");
    return this.inprogress;
  }

  getAwaitFeedbackList(): Task[]{
    this.awaitfeedback = this.getTasksListByStatus("await feedback");
    return this.awaitfeedback;
  }
  getDoneList(): Task[] {
    this.done = this.getTasksListByStatus("done");
    return this.done;
  }
  // getLength(status: string): number{
  //   const taskByStatus = this.getTasksListByStatus(status);
  //   return taskByStatus.length;
  // }
  // #endregion
}
