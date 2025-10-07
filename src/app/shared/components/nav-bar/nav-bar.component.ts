import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  imports: [CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {
  @Output() selectedActiveComponent = new EventEmitter<string>();
  
  navigateToComponent(event: Event, targetComponent: string){
    event.preventDefault(); //avoid page reload
    this.selectedActiveComponent.emit(targetComponent);
  }
}
