import { Component, inject } from '@angular/core';
import { TaskService } from '../../shared/services/task.service';
import { Task, TASK_STATUS } from '../../shared/interfaces/task';
import { Subscription } from 'rxjs';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-summary',
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
    this.filterLowestDate()

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

  filterLowestDate() {
    // const array: Task["date"][] = [];
    this.tasks.forEach(task =>
      console.log(task.date!.valueOf())
    );
    // return array;
  }

  // TODO: Funktion für mittleren summary-teil
  // Ein Array erstellen mit allen timestamps von den Tasks
  // den kleinsten Wert aus dem Array herausfiltern
  // => Wert für deadline-date
  // aus dem tasks-array alle tasks mit dem 

}





