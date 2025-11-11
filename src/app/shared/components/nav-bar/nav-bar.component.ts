import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Navigation bar component for switching between main views.
 */
@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
/**
 * NavBarComponent
 *
 * Renders a navigation menu that allows users to switch between main views
 * (e.g., Summary, Board, Contacts). Highlights the currently active component
 * and emits navigation events to the parent.
 */
export class NavBarComponent {
  // #region ATTRIBUTES
  /**
   * The name of the currently open/active component.
   * Used to highlight the active nav item.
   */
  @Input() nowOpen = "";

  /**
   * The context in which this nav bar is shown.
   * Determines styling and behavior (main app vs login page).
   * @default 'main'
   */
  @Input() context: 'main' | 'login' = 'main';

  /**
   * Emits the selected active component name when a nav item is clicked.
   */
  @Output() selectedActiveComponent = new EventEmitter<string>();
  // #endregion

  // #region METHODS
  /**
   * Emits an event to navigate to a target component.
   *
   * @param {Event} event - The click event.
   * @param {string} targetComponent - The target component name.
   * @returns {void}
   */
  navigateToComponent(event: Event, targetComponent: string): void {
    event.preventDefault(); //avoid page reload
    this.selectedActiveComponent.emit(targetComponent);
  }

  /**
   * Checks whether the provided component is currently active.
   *
   * @param {string} component - The component name to check
   * @returns {boolean} true if the component matches the currently open component
   */
  checkActiveComponent(component: string): boolean {
    return this.nowOpen === component; 
  }
  // #endregion
}
