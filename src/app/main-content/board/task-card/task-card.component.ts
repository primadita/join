import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-task-card',
  imports: [],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
})
export class TaskCardComponent {
  @Input() task!: any;
  @Output() openTask = new EventEmitter<any>();

  onClick() {
    this.openTask.emit(this.task);
  }
}
