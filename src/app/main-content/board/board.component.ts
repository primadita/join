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
import { map } from 'rxjs';
import { BoardColumns } from '../../shared/interfaces/boardColumns';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AddTaskComponent } from '../../shared/components/add-task/add-task.component';

/*
  -------------------------------------------------------------------------------------------------------------------------

  PROBLEM:
  - Beim Drag&Drop-Event gibt die CDK im Event nur UI-Infos zurück (evet.container.id = ("toDoList", "inProgessList",...)
  - Im Task haben wir aber ("to do" | "in progress")
  - Wir müssen also UI-IDs und Status übersetzen
  - Zusätzlich sollten wir KEINEN lokalen Board-State haben, sondern alles aus dem Service-Stream ableiten

  ZIELE:
  - Reaktive UI: Jede Datenänderung in Firestore wird automatisch im Board angezeigt
  - Sauberer Drag&Drop-Flow: sofortiges visuelles Feedback + sauberer Statuswechsel 
  - Klare Trennung von UI (IDs) und Task (Status)
  - Eine Wahrheitsquelle: TaskService.task$ (keine lokalen Arrays)

  -------------------------------------------------------------------------------------------------------------------------
*/

// ###### Typen absicherung ######
/*
  Nur eine Quelle der Wahrheit (hier Task-Interface und ListID)
  ListId sagt genau wie die ids genannt werden sollen
  Status-Typ wird aus dem Interface gelesen
*/
type Status = Task['status'];

type ListId = 'toDoList' | 'inProgressList' | 'awaitFeedbackList' | 'doneList';

/*
  Mapping UI-Liste - Task Status
  - ListIdToStatus Ist ein Objekt
  - Links sind die UI-Begriffe
  - Rechts sind Task-Status
  - Durch Record dürfen die Keys nur vom type ListID sein und die values nur vom type Status
  Vorteil: 
  - Ganze Übersetzung ist an einer Stelle
*/
const ListIdToStatus: Record<ListId, Status> = {
  toDoList: 'to do',
  inProgressList: 'in progress',
  awaitFeedbackList: 'await feedback',
  doneList: 'done',
};


@Component({
  selector: 'app-board',
  imports: [CommonModule, DragDropModule, TaskCardComponent, TaskDetailsComponent,
    CdkDropList, CdkDrag, FormsModule, AddTaskComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  // #region ATTRIBUTES
  taskService = inject(TaskService);
  /*
  board$ leitet aus tasks$ die vier Spalten ab
  - taks$ ist ein Observable aus dem Task-Service
  - pipe(...) transfomiert board$ auch zu einen Observable
  - aber vom Typ Observable <BoardColumns> - also ein Objekt mit 4 Arrays für die 4 Spalten
  - Durch map wird bei jeder Änderung der Task die Board-Struktur neu berechnet - reaktiv 
  - Wenn Firestore pusht, rechnet map neu, board$ emittiert neu, UI-Aktualisiert sich
  */
  board$ = this.taskService.tasks$.pipe(
    map(
      (tasks) =>
        ({
          //jede Zeile sagt klar, was in die Spalte gehört
          todo: tasks.filter((t) => t.status === 'to do'),
          inprogress: tasks.filter((t) => t.status === 'in progress'),
          awaitfeedback: tasks.filter((t) => t.status === 'await feedback'),
          done: tasks.filter((t) => t.status === 'done'),
          // hiermit hat das Objekt exakt die Felder todo, inprogress usw. exakt dem Interface BoardColumns
        } as BoardColumns)
    )
  );

  selectedTask: Task | null = null; // Variable für TaskCard, die gewählt ist
  showDetail = false; //Defaultzustand von Taskcard, wenn true, dann wird Task Details angezeigt
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

  /*
  Drag&Drop
  - wird sofort visuell dargestellt
  - den verschobenen Task holen wir über [cdkDragData]="task" im Template 
  - CDK ruft diese Funktion nur auf wenn etwas losgelassen wird 
  */
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

    /*
      Welcher Task wurde bewegt?
      - Im HTML Drag-Element [cdkDragData]="task"] 
      - Zuverlässiger als mit Index
    */
    const movedTask = event.item.data as Task;

    // Ziel-Status aus Liste ableiten
    const newStatus = ListIdToStatus[event.container.id as ListId];
    if (!newStatus) return;

    // Nur speichern, wenn sich der Status wirklich geändert hat
    if (movedTask.status !== newStatus) {
      /*
        - Beim Spaltenwechsel gibt es ein Update
        - ...movedTask kopiert das Objekt movedTask flach 
        - es wird nur der status geändert der rest bleibt gleich

        Was passiert wenn wir es nicht flach kopieren?
        Wenn wir es direkt verändern mit movedTask.status = newStatus dann:
        - Ändert sich das gleiche Objekt im Speicher, auf das auch andere stellen zeigen wie:
        - die UI, Arrays, Observables usw.
        - Angular sieht das nicht sofort, weil sich die Referenz des objektes nicht geändert hat
        - Angular erkennt Änderungen am besten, wenn sich die Referenz ändert - also ein neues Objekt entsteht
      */
      const updated: Task = { ...movedTask, status: newStatus };
      // Firestore-Update triggert automatisch neue Werte in board$ -> UI ist konsistent
      this.taskService.updateTask(updated);
    }
  }

  getTasksList(): Task[]{
    if(this.searchResult.length > 0){
      return this.searchResult;
    } else {
      return this.board$;
    }
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
