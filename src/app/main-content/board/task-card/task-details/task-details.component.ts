import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-task-details',
  imports: [CommonModule],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss',
})
export class TaskDetailsComponent {
  @Input() task: any;
  @Output() close = new EventEmitter<void>();

  closing = false;

  onClose() {
    this.closing = true;
    setTimeout(() => this.close.emit(), 220);
  }
}
