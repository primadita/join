import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { AddTaskComponent } from '../../../shared/components/add-task/add-task.component';
import { Task } from '../../../shared/interfaces/task';

@Component({
  selector: 'app-add-task-popup',
  imports: [CommonModule, AddTaskComponent],
  templateUrl: './add-task-popup.component.html',
  styleUrl: './add-task-popup.component.scss'
})
export class AddTaskPopupComponent {
  @Output() close = new EventEmitter<void>;
  @Output() clear = new EventEmitter<void>;
  @Output() create = new EventEmitter<Task>;
  isOpen: boolean = true;

  closeWindow(event? : MouseEvent){
  if (event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.task-details')) {
      this.isOpen = false; // oder whatever schließt das Pop-up
    }
  } else {
    this.isOpen = false;
  }

    // this.close.emit();
  }

  clearForm(){
    this.clear.emit();
  }
  
  createNewTask(newTask: Task){
    this.create.emit(newTask);
  }
}
