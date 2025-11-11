import { Component, EventEmitter, Output } from '@angular/core';
import { AddTaskComponent } from '../../shared/components/add-task/add-task.component';
import { ToastMessageComponent } from '../../shared/components/toast-message/toast-message.component';

@Component({
  selector: 'app-add-task-view',
  standalone: true,
  imports: [AddTaskComponent, ToastMessageComponent],
  templateUrl: './add-task-view.component.html',
  styleUrl: './add-task-view.component.scss',
})
export class AddTaskViewComponent {
  // #region ATTRIBUTES
  @Output() switchAddTaskToBoard = new EventEmitter<string>();
  // #endregion

  // #region METHODS
  onTaskCreated(){
    this.switchAddTaskToBoard.emit('board');
  }
  // #endregion
}
