import { CommonModule } from '@angular/common';
import { Component, inject, NgModule } from '@angular/core';
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
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AddTaskComponent } from '../../shared/components/add-task/add-task.component';

@Component({
  selector: 'app-board',
  imports: [CommonModule, DragDropModule, TaskCardComponent, TaskDetailsComponent,
    CdkDropList, CdkDrag, FormsModule, AddTaskComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  // #region ATTRIBUTES
  selectedTask: Task | null = null; // Variable für TaskCard, die gewählt ist
  showDetail = false; //Defaultzustand von Taskcard, wenn true, dann wird Task Details angezeigt
  taskService = inject(TaskService); // Inject für Firestore Tasks
  cdr = inject(ChangeDetectorRef); //Extra Feature für Firestore, das beim Detektieren bei der Änderung in Firestore hilft
  searchInput: string = ''; // Variable für Input in Suchfeld
  searchResult: Task[] = []; // Array für alle Ergebnisse von dem Suchen
  noResults: boolean = true; //Flag für no-result-div. Wenn true, wird die Nachricht "no results were found" nicht angezeigt
  addTaskWindow: boolean = false; // Flag für add task overlay oder Window
  // #endregion

  // #region METHODS
  openTask(task: Task) { // Zum Öffnen von Task Details
    this.selectedTask = task;
    this.showDetail = true;
  }

  closeTask() { // Zum Schließen der Task Details
    this.showDetail = false;
    this.selectedTask = null;
  }

  drop(event: CdkDragDrop<Task[]>) { //Zum Droppen des Elements. Wenn nur die Reihenfolge in derselben Liste geändert, dann wird nur MoveItemInArray aufgerufen. Wenn in andere Liste gedropped wird, dann TransferArrayItem
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

    const movedTask = event.container.data[event.currentIndex]; //Variable für das bewegte Element
    // Status des Elements soll geändert werden
    if (event.container.id === 'toDoList') { 
      movedTask.status = 'to do';
    }
    if (event.container.id === 'inProgressList') {
      movedTask.status = 'in progress';
    }
    if (event.container.id === 'awaitFeedbackList') {
      movedTask.status = 'await feedback';
    }
    if (event.container.id === 'doneList') {
      movedTask.status = 'done';
    }
    this.taskService.updateTask(movedTask); //Die Änderung soll in Firebase aktualisiert werden
    this.cdr.detectChanges(); // Hier soll das Extra Feature, die Änderung detektieren und die Methoden getToDoList(), getAwaitFeedback(), usw. aktualisiert werden
  }

  getTasksList(): Task[]{ //Aufrufen von allen Tasks in Firebase
    if(this.searchResult.length > 0){
      return this.searchResult;
    } else {
      return this.taskService.tasksList;
    }
    
  }

  getTasksListByStatus(status: string): Task[] { // Alle Tasks werden nach Status gefiltert.
    return this.getTasksList().filter((arr) => arr.status === status);
  }
  
  getToDoList(): Task[]{ // Alle Tasks, die Status "To Do" hat
    return this.getTasksListByStatus("to do");
  }
  
  getInProgressList(): Task[]{ // Alle Tasks, die Status "in progress" hat
    return this.getTasksListByStatus("in progress");
  }

  getAwaitFeedbackList(): Task[]{ // Alle Tasks, die Status "await feedback" hat
    return this.getTasksListByStatus("await feedback");
  }

  getDoneList(): Task[] {// Alle Tasks, die Status "done" hat
    return this.getTasksListByStatus("done");
  }

  searchInTitleAndDesc(){
    // Ändern searchInput in lower case
    const query = this.searchInput.toLowerCase();
    if(!query){ //Bedingung wenn keine Input eingetragen ist
      this.searchResult = [];
      this.noResults = true;
      return;
    } else { //wenn Input eingetragen ist
      this.searchResult = this.getTasksList().filter(task => task.title.toLowerCase().includes(query) || task.description.toLowerCase().includes(query));
      if(this.searchResult.length === 0){
        this.noResults = false;
      } else {
        this.noResults = true;
      }
    }
  }

  // getLength(status: string): number{
  //   const taskByStatus = this.getTasksListByStatus(status);
  //   return taskByStatus.length;
  // }

  toggleAddTask(){
    this.addTaskWindow = !this.addTaskWindow;
  }
  closeAddTaskPopup() {
    this.addTaskWindow = false;
  }
  // #endregion
}
