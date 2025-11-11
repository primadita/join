import { Component, inject, OnInit } from '@angular/core';
import { TaskService } from '../../shared/services/task.service';
import { Task, TASK_PRIORITY, TASK_STATUS } from '../../shared/interfaces/task';
import { Subscription } from 'rxjs';
import { Timestamp } from '@angular/fire/firestore';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
/**
 * SummaryComponent
 *
 * Displays an overview dashboard showing task statistics, upcoming deadlines,
 * and priority information for the current user.
 */
export class SummaryComponent implements OnInit {

  /**
   * Injected AuthService to access current user information.
   */
  authService = inject(AuthService);

  /**
   * List of all tasks (updated via subscription to TaskService).
   */
  tasks: Task[] = [];

  /**
   * Subscription to the tasks$ observable. Stored for cleanup in ngOnDestroy.
   */
  private tasksSub?: Subscription;

  /**
   * Display name of the currently logged-in user.
   */
  userName: string | null | undefined;

  constructor(private taskService: TaskService, private router: Router) { }

  /**
   * Component init lifecycle hook.
   *
   * Subscribes to task updates and auth state to populate the summary data.
   *
   * @returns {void}
   */
  ngOnInit(): void {
    this.tasksSub = this.taskService.tasks$.subscribe(tasks => {
      this.tasks = tasks;
    });
    this.authService.getCurrentUser();
    this.authService.currentUser.subscribe((user) => {
      this.userName = user?.displayName;
    });
    this.authService.isLoggedIn();
  }

  /**
   * Component destroy lifecycle hook.
   *
   * Unsubscribes from the tasks$ observable to prevent memory leaks.
   *
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.tasksSub?.unsubscribe();
  }

  /**
   * Filters tasks by the given status and returns the count.
   *
   * @param {string} status - The task status to filter by
   * @returns {number} The count of tasks matching the status
   */
  filterTodo(status: string): number {
    const array = this.tasks.filter((task) =>
      task.status === status
    );
    return array.length;
  }

  /**
   * Returns the total count of tasks that are not done.
   *
   * @returns {number} Total tasks minus done tasks
   */
  tasksWithoutDone(): number {
    return this.tasks.length - this.filterTodo('done');
  }

  /**
   * Returns an array of all tasks that are not marked as done.
   *
   * @returns {Task[]} Array of incomplete tasks
   */
  undoneTasks(): Task[] {
    const undoneTasksArray = this.tasks.filter(t => t.status !== TASK_STATUS.DONE);
    return undoneTasksArray;
  }

  /**
   * Finds the earliest upcoming deadline from incomplete tasks.
   *
   * @returns {number} Unix timestamp (seconds) of the lowest date, or 1 if none found
   */
  getLowestDate(): number {
    const dateJSONs: any[] = [];
    const secondsArray: number[] = [];
    let lowDate = 1;
    this.undoneTasks().forEach(task =>
      dateJSONs.push(task.date?.toJSON())
    );
    dateJSONs.forEach(e =>
      secondsArray.push(e.seconds)
    );

    const datesOverNow = secondsArray.filter(d => d > (Date.now() / 1000));
    if (datesOverNow.length > 0) {
      lowDate = Math.min.apply(null, datesOverNow);
    }
    return lowDate;
  }

  /**
   * Returns a human-readable string of the lowest upcoming deadline.
   *
   * @returns {string} Formatted date string, or 'No upcoming Deadline'
   */
  showLowestDateString(): string {
    if (this.getLowestDate() === 1) {
      return 'No upcoming Deadline';
    } else {
      const dateFormat = new Date(this.getLowestDate() * 1000);
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const lowestDateString = dateFormat.toLocaleDateString("en-EN", options);
      return lowestDateString;
    }
  }

  /**
   * Filters incomplete tasks to those with the lowest upcoming deadline.
   *
   * @returns {Task[]} Tasks matching the lowest deadline date
   */
  filterLowestTasks(): Task[] {
    const timestamp = new Timestamp(this.getLowestDate(), 0);
    const array = this.undoneTasks().filter((task) =>
      task.date?.valueOf() === timestamp.valueOf()
    );
    return array;
  }

  /**
   * Filters tasks with the lowest deadline by priority and returns the highest priority group.
   * Priority order: Urgent > Medium > Low.
   *
   * @returns {Task[]} Tasks sorted by highest priority
   */
  filterPriority(): Task[] {
    const taskArray = this.filterLowestTasks();
    const urgentArray = taskArray.filter(t => t.priority === TASK_PRIORITY.URGENT);
    const mediumArray = taskArray.filter(t => t.priority === TASK_PRIORITY.MEDIUM);
    const lowArray = taskArray.filter(t => t.priority === TASK_PRIORITY.LOW);
    if (urgentArray.length > 0) {
      return urgentArray;
    } else if (mediumArray.length > 0) {
      return mediumArray;
    } else if (lowArray.length > 0) {
      return lowArray;
    } else {
      return urgentArray;
    }
  }

  /**
   * Converts the priority of the first filtered task to a readable string.
   *
   * @returns {string | undefined} Priority string ("Urgent", "Medium", "Low") or undefined
   */
  convertPrioToString(): string | undefined {
    const prio = this.filterPriority()[0]?.priority;
    if (prio === TASK_PRIORITY.URGENT) {
      return "Urgent";
    } else if (prio === TASK_PRIORITY.MEDIUM) {
      return "Medium";
    } else if (prio === TASK_PRIORITY.LOW) {
      return "Low";
    } else {
      return undefined;
    }
  }
}





