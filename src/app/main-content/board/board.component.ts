/**
 * @fileoverview BoardComponent provides a reactive Kanban board UI
 * that displays tasks organized by status. Tasks can be searched, dragged
 * between columns, and updated in real-time through the TaskService.
 *
 * Key features:
 * - Reactive design: updates automatically on Firestore changes.
 * - Clean drag-and-drop handling via Angular CDK.
 * - Clear separation between UI identifiers and task status values.
 * - Single source of truth via TaskService.
 */
import { CommonModule } from '@angular/common';
import { Component, inject, Input, NgModule} from '@angular/core';
import { 
  CdkDrag, 
  CdkDragDrop, 
  CdkDropList, 
  DragDropModule, 
  moveItemInArray, 
  transferArrayItem} from '@angular/cdk/drag-drop';
import { BreakpointObserver } from '@angular/cdk/layout'; 
import { TaskCardComponent } from './task-card/task-card.component';
import { TaskDetailsComponent } from './task-card/task-details/task-details.component';
import { TaskService } from '../../shared/services/task.service';
import { Task, TASK_STATUS } from '../../shared/interfaces/task';
import { combineLatest, map, shareReplay, startWith } from 'rxjs';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddTaskPopupComponent } from './add-task-popup/add-task-popup.component';
import { BoardColumns } from '../../shared/interfaces/boardColumns';
import { ToastMessageComponent } from '../../shared/components/toast-message/toast-message.component';
import { LongPressDragDirective } from '../../shared/directives/long-press-drag.directive';

/**
 * Represents the task status derived from the Task interface.
 * @typedef {Task['status']} Status
 */
type Status = Task['status'];

/**
 * Represents the allowed UI list IDs for drag-and-drop lists.
 * @typedef {'toDoList' | 'inProgressList' | 'awaitFeedbackList' | 'doneList'} ListId
 */
type ListId = 'toDoList' | 'inProgressList' | 'awaitFeedbackList' | 'doneList';

/**
 * Maps between UI list IDs and task status values.
 * Ensures strong typing via Record<ListId, Status>.
 * @constant
 * @type {Record<ListId, Status>}
 */
const ListIdToStatus: Record<ListId, Status> = {
  toDoList: 'to do',
  inProgressList: 'in progress',
  awaitFeedbackList: 'await feedback',
  doneList: 'done',
};
@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, DragDropModule, TaskCardComponent, TaskDetailsComponent,
    CdkDropList, CdkDrag, FormsModule, AddTaskPopupComponent, ReactiveFormsModule, ToastMessageComponent, LongPressDragDirective],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})

/**
 * BoardComponent is the main Kanban board view.
 * It manages columns for tasks by status, enables drag-and-drop reordering,
 * integrates task creation via a popup, and filters tasks via search.
 */
export class BoardComponent {
  // #region ATTRIBUTES
  /** Service responsible for task data management. */
  taskService = inject(TaskService);

  /**
   * Reactive form control for search input.
   * Emits a value on each input change.
   * @type {FormControl<string | null>}
   */
  searchControl = new FormControl('');
  /**
   * Observable emitting lowercase search input text.
   * @type {Observable<string>}
   */
  searchInput$= this.searchControl.valueChanges.pipe(startWith(''),
    map(e => e ? e.toLowerCase():'')); 
  
  /**
   * Observable emitting a filtered list of tasks based on the search input.
   * @type {Observable<Task[]>}
   */
  filteredTasks = combineLatest([this.taskService.tasks$, this.searchInput$]).pipe(
    map(
      ([alltasks, search]) => search 
        ? alltasks.filter(
          a => a.title.toLowerCase().includes(search)|| a.description.toLowerCase().includes(search))
          : alltasks));
  
  /**
   * Reactive board structure divided into four columns.
   * Automatically recalculated whenever tasks or search terms change.
   * @type {Observable<BoardColumns>}
   */
  board$ = this.filteredTasks.pipe(
    map((filtered) =>
    ({
      todo: filtered.filter( task => task.status === TASK_STATUS.TO_DO),
      inprogress: filtered.filter( task => task.status === TASK_STATUS.IN_PROGRESS),
      awaitfeedback: filtered.filter(task => task.status === TASK_STATUS.AWAIT_FEEDBACK),
      done: filtered.filter(task => task.status === TASK_STATUS.DONE)
    } as BoardColumns))// hiermit hat das Objekt exakt die Felder todo, inprogress usw. exakt dem Interface BoardColumns
  );
  

  /**
   * Breakpoint observer injected from CDK Layout. Used to detect
   * viewport changes (mobile vs desktop) and adapt the UI.
   */
  mobileObserver = inject(BreakpointObserver);

  /**
   * Emits true when the viewport matches the mobile breakpoint.
   * Used to toggle mobile-specific layout and behavior.
   * @type {Observable<boolean>}
   */
  isMobile$ = this.mobileObserver.observe([`(max-width: 640px)`]).pipe(
    map((result) => result.matches), shareReplay(1)
  );

  /** The currently selected task for viewing details. */
  selectedTask: Task | null = null; 
  
  /** Whether the task details panel is visible. */
  showDetail = false; 
  
  /**
   * Observable that emits `true` if a search has input but no results are found.
   * @type {Observable<boolean>}
   */
  showNoResult$ = combineLatest([this.searchInput$, this.filteredTasks]).pipe(
    map(([i, t]) => i.trim().length > 0 && t.length === 0));
  
  /**
   * Flag indicating whether the "Add Task" popup is open.
   * When true the popup component is rendered and receives focus.
   * @default false
   */
  addTaskWindow: boolean = false;

  /**
   * The currently selected list status used when creating a new task.
   * Defaults to the 'to do' status.
   */
  currentList: Status = TASK_STATUS.TO_DO;

  /**
   * Optional input (string) that can be used to initialize the active
   * board column from a parent component. The component maps this value
   * to internal `currentList` when opening the Add Task dialog.
   */
  @Input() initialList: string = '';
  // #endregion

  // #region METHODS
  /**
   * Opens the task details view for the provided task.
   * @param {Task} task - The task to open.
   */
  openTask(task: Task) { 
    this.selectedTask = task;
    this.showDetail = true;
  }

  /**
   * Closes the currently open task details view.
   */
  closeTask() { 
    this.showDetail = false;
    this.selectedTask = null;
  }

  /**
   * Handles drag-and-drop events when a task is moved between lists.
   * Updates the task status in Firestore if it has changed.
   *
   * @param {CdkDragDrop<Task[]>} event - The drag-and-drop event containing task data.
   */
  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }

    const movedTask = event.item.data as Task;
    const newStatus = ListIdToStatus[event.container.id as ListId];
    if (!newStatus) return
    if (movedTask.status !== newStatus) {
      const updated: Task = { ...movedTask, status: newStatus };
      this.taskService.updateTask(updated);
    }
  }

  /**
   * Toggles the Add Task popup and sets the current list status.
   * @param {string} [list] - Optional list name to preselect in the popup.
   */
  toggleAddTask(list?:string){
    this.addTaskWindow = !this.addTaskWindow;
    this.currentList = TASK_STATUS.TO_DO;
    switch (list) {
      case 'to do':{
        this.currentList = TASK_STATUS.TO_DO;
        break;
      }
      case 'in progress':{
        this.currentList = TASK_STATUS.IN_PROGRESS;
        break;
      }
      case 'await feedback':{
        this.currentList = TASK_STATUS.AWAIT_FEEDBACK;
        break;
      }
    }
  }

  /**
   * Closes the Add Task popup.
   */
  /**
   * Closes the Add Task popup and clears any transient UI state.
   *
   * @returns {void}
   */
  onClosePopUp(): void {
    this.addTaskWindow = false;
  }

  /**
   * Opens the Add Task popup, typically after clearing input fields.
   */
  /**
   * Open the Add Task popup. Typically used after clearing inputs so the
   * user can enter a new task.
   *
   * @returns {void}
   */
  clearInputTask(): void {
    this.addTaskWindow = true;
  }
  
  /**
   * Creates a new task and adds it to Firestore.
   * @param {Task} newTask - The new task object to create.
   */
  /**
   * Creates a new task, assigns the currently selected list status and
   * persists it via the TaskService.
   *
   * @param {Task} newTask - The new task object to create.
   * @returns {void}
   */
  createNewTask(newTask: Task): void {
    this.addTaskWindow = false;
    newTask.status = this.currentList;
    this.taskService.addTask(newTask);
  }

  /**
   * Highlights a drop list element visually when a drag event hovers over it.
   * @param {CdkDropList} list - The list element to highlight.
   */
  highlightDropList(list: CdkDropList) {
    const element = list.element.nativeElement as HTMLElement;
    element.classList.add('drag-over');
  }
  /**
   * Removes the highlight from a drop list after a drag event ends.
   * @param {CdkDropList} list - The list element to unhighlight.
   */
  unhighlightDropList(list: CdkDropList) {
    const element = list.element.nativeElement as HTMLElement;
    element.classList.remove('drag-over');
  }

  /**
   * Combines unhighlighting and drop handling in a single event.
   * @param {CdkDragDrop<Task[]>} event - The drag-and-drop event.
   * @param {CdkDropList} list - The drop list element to unhighlight.
   */
  dropAndUnhighlight(event: CdkDragDrop<Task[]>, list: CdkDropList){
    this.unhighlightDropList(list);
    this.drop(event);
  }

  /**
   * Move a task to a new status programmatically (not via drag-and-drop).
   * The method avoids unnecessary updates when the task already has the
   * target status.
   *
   * @param {{task: Task, status: Status}} event - object containing the task and target status
   * @returns {void}
   */
  moveTaskToList(event: { task: Task; status: Status }): void {
    const { task, status } = event;
    if (task.status === status) return;
    const updated = { ...task, status };
    this.taskService.updateTask(updated);
  }
  // #endregion
}
