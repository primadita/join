import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { AddTaskComponent } from '../../../shared/components/add-task/add-task.component';

@Component({
  selector: 'app-add-task-popup',
  imports: [CommonModule, AddTaskComponent],
  templateUrl: './add-task-popup.component.html',
  styleUrl: './add-task-popup.component.scss'
})
export class AddTaskPopupComponent {
  @Output() close = new EventEmitter<void>;

  closeWindow(){
    this.close.emit();
  }
}
