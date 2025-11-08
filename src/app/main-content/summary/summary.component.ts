import { Component, inject } from '@angular/core';
import { TaskService } from '../../shared/services/task.service';
import { Task, TASK_PRIORITY, TASK_STATUS } from '../../shared/interfaces/task';
import { Subscription } from 'rxjs';
import { Timestamp } from '@angular/fire/firestore';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent {

  authService = inject(AuthService);
  tasks: Task[] = [];
  private tasksSub?: Subscription;
  userName: string | null | undefined;
  

  constructor(private taskService: TaskService) { }

  ngOnInit() {
    this.tasksSub = this.taskService.tasks$.subscribe(tasks => {
      this.tasks = tasks;
    });
    this.authService.currentUser.subscribe( (user) => {
      this.userName = user?.displayName;
    })
    this.authService.getCurrentUser();
  }

  ngOnDestroy() {
    this.tasksSub?.unsubscribe();
    this.authService.currentUser.unsubscribe();
  }

  filterTodo(status: string): number {
    const array = this.tasks.filter((task) =>
      task.status == status
    );
    return array.length;
  }

  tasksWithoutDone(): number {
    return this.tasks.length - this.filterTodo('done');
  }

  undoneTasks() {
    const undoneTasksArray = this.tasks.filter(t => t.status != TASK_STATUS.DONE);
    return undoneTasksArray;
  }

  getLowestDate() {
    const dateJSONs: any[] = [];
    const secondsArray: number[] = [];
    let lowDate = 1
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

  showLowestDateString() {
    if (this.getLowestDate() == 1) {
      return 'No upcoming Deadline'
    } else {
      const dateFormat = new Date(this.getLowestDate() * 1000);
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const lowestDateString = dateFormat.toLocaleDateString("en-EN", options);
      return lowestDateString
    }
  }

  filterLowestTasks() {
    const timestamp = new Timestamp(this.getLowestDate(), 0)
    const array = this.undoneTasks().filter((task) =>
      task.date?.valueOf() === timestamp.valueOf()
    );
    return array;
  }

  filterPriority() {
    const taskArray = this.filterLowestTasks();
    const urgentArray = taskArray.filter(t => t.priority == TASK_PRIORITY.URGENT);
    const mediumArray = taskArray.filter(t => t.priority == TASK_PRIORITY.MEDIUM);
    const lowArray = taskArray.filter(t => t.priority == TASK_PRIORITY.LOW);
    if (urgentArray.length > 0) {
      return urgentArray
    } else if (mediumArray.length > 0) {
      return mediumArray
    } else if (lowArray.length > 0) {
      return lowArray
    } else {
      return urgentArray;
    }
  }

  convertPrioToString() {
    const prio = this.filterPriority()[0]?.priority;
    if (prio == TASK_PRIORITY.URGENT) {
      return "Urgent"
    } else if (prio == TASK_PRIORITY.MEDIUM) {
      return "Medium"
    } else if (prio == TASK_PRIORITY.LOW) {
      return "Low"
    } else {
      return undefined
    }
  }
}





