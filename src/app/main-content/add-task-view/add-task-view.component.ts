import { Component } from '@angular/core';
import { AddTaskComponent } from '../../shared/components/add-task/add-task.component';

@Component({
  selector: 'app-add-task-view',
  imports: [AddTaskComponent],
  templateUrl: './add-task-view.component.html',
  styleUrl: './add-task-view.component.scss'
})
export class AddTaskViewComponent {

}
