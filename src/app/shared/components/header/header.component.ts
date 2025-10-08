import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})

/**
 * Header component that manages the state of the navigation bar.
 */
export class HeaderComponent {
  // #region ATTRIBUTES
  /**
   * Indicates whether the navigation bar is currently active (visible).
   * @default false
   */
  navActive:boolean = false;
  
  /**
   * Emits event to call help page.
   */
  @Output() callHelpPage = new EventEmitter<string>();
  // #endregion

  // #region METHODS
  /**
   * Toggles the navigation bar's active state.
   */
  toggleNavbar():void{
    this.navActive = !this.navActive;
  }

  /**
   * Emits an event to navigate to a target component.
   * @param {Event} event - The click event.
   * @param {string} targetComponent - The target component name.
   */
  navigateToComponent(event: Event, targetComponent: string){
    event.preventDefault(); //avoid page reload
    this.callHelpPage.emit(targetComponent);
  }
  // #endregion
}
