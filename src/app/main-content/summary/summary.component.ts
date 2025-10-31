import { Component, inject } from '@angular/core';
import { TaskService } from '../../shared/services/task.service';
import { Task, TASK_STATUS } from '../../shared/interfaces/task';
import { Subscription } from 'rxjs';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent {


  tasks: Task[] = [];
  private tasksSub?: Subscription;

  constructor(private taskService: TaskService) { }

  ngOnInit() {
    this.tasksSub = this.taskService.tasks$.subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  ngOnDestroy() {
    this.tasksSub?.unsubscribe();
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

  // filterLowestDate() {
  //   const array: any[] = [];
  //   const secondArray: number[] = [];
  //   this.tasks.forEach(task =>
  //     array.push(task.date?.toJSON())
  //   );
  //   array.forEach(e =>
  //     secondArray.push(e.seconds)
  //   );

  //   const lowDate = Math.min.apply(null, secondArray)
  //   const dateFormat = new Date(lowDate * 1000);
  //   const options: Intl.DateTimeFormatOptions = {
  //     year: "numeric",
  //     month: "long",
  //     day: "numeric",
  //   };
  //   const lowestDateString = dateFormat.toLocaleDateString("en-EN", options);


  //   // console.log(lowDate);
  //   // console.log(dateFormat.toLocaleDateString("en-EN", options));
  //   return lowestDateString
  // }

  getLowestDate() {
    const dateJSONs: any[] = [];
    const secondsArray: number[] = [];
    this.tasks.forEach(task =>
      dateJSONs.push(task.date?.toJSON())
    );
    dateJSONs.forEach(e =>
      secondsArray.push(e.seconds)
    );

    const datesOverNow = secondsArray.filter(d => d > (Date.now() / 1000));
    const lowDate = Math.min.apply(null, datesOverNow);
    console.log(lowDate);

    return lowDate;
  }

  showLowestDateString() {
    if (this.getLowestDate() == Infinity) {
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
    const array = this.tasks.filter((task) =>
      task.date?.valueOf() === timestamp.valueOf()
    );
    return array;
  }

  // showDates() {
  //   const array: any[] = [];
  //   const secondArray: number[] = [];
  //   this.tasks.forEach(task =>
  //     array.push(task.date?.toJSON())
  //   );
  //   array.forEach(e =>
  //     secondArray.push(e.seconds)
  //   );

  //   const lowDate = Math.min.apply(null, secondArray)
  //   const dateFormat = new Date(lowDate * 1000);

  //   const timestamp = new Timestamp(lowDate, 0)
  //   console.log(timestamp);

  //   console.log(dateFormat.getTime());

  //   console.log(this.tasks[1].date);

  // }



  // TODO: Funktion für mittleren summary-teil
  // Ein Array erstellen mit allen timestamps von den Tasks
  // den kleinsten Wert aus dem Array herausfiltern
  // => Wert für deadline-date
  // aus dem tasks-array alle tasks mit dem 

}





