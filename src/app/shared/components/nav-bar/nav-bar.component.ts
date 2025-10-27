import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Navigation bar component for switching between main views.
 */
@Component({
  selector: 'app-nav-bar',
  imports: [CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {
  // #region ATTRIBUTES
  @Input()nowOpen = "";
  /**
   * Emits the selected active component.
   */
  @Output() selectedActiveComponent = new EventEmitter<string>();
  // #enregion

  // #region METHODS
  /**
   * Emits an event to navigate to a target component.
   * @param {Event} event - The click event.
   * @param {string} targetComponent - The target component name.
   */
  navigateToComponent(event: Event, targetComponent: string){
    event.preventDefault(); //avoid page reload
    this.selectedActiveComponent.emit(targetComponent);
  }

  checkActiveComponent(component: string):boolean{
    return this.nowOpen === component; 
  }
  // #endregion
}
