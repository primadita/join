import { Component } from '@angular/core';
import { TaskCardComponent } from './task-card/task-card.component';
import { TaskDetailsComponent } from './task-card/task-details/task-details.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-board',
  imports: [CommonModule, TaskCardComponent, TaskDetailsComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  showDetail = false;

  openTask() {
    this.showDetail = true;
  }

  closeTask() {
    this.showDetail = false;
  }
}
