import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop' ;
import { TaskCardComponent } from './task-card/task-card.component';
import { TaskDetailsComponent } from './task-card/task-details/task-details.component';

@Component({
  selector: 'app-board',
  imports: [CommonModule, DragDropModule, TaskCardComponent, TaskDetailsComponent, CdkDropList, CdkDrag],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  showDetail = false;
  todo = ['to do 1', 'to do 2'];
  inprogress = ['in progress 1', 'in progress 2'];
  awaitfeedback =  ['await 1'];
  done = ['await'];

  openTask() {
    this.showDetail = true;
  }

  closeTask() {
    this.showDetail = false;
  }
  
  drop(event: CdkDragDrop<string[]>){
    if(event.previousContainer === event.container){
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }else{
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }
}
