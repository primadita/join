import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ContactsComponent } from './contacts/contacts.component';
import { NavBarComponent } from '../shared/components/nav-bar/nav-bar.component';
import { HeaderComponent } from '../shared/components/header/header.component';
import { LegalNoticeComponent } from '../shared/components/legal-notice/legal-notice.component';
import { PrivacyPolicyComponent } from '../shared/components/privacy-policy/privacy-policy.component';
import { HelpComponent } from '../shared/components/help/help.component';
import { CommonModule } from '@angular/common';
import { SelectContactService } from '../shared/services/select-contact.service';
import { BoardComponent } from './board/board.component';
import { AddTaskViewComponent } from './add-task-view/add-task-view.component';
import { SummaryComponent } from './summary/summary.component';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [
    CommonModule,
    ContactsComponent,
    NavBarComponent,
    HeaderComponent,
    LegalNoticeComponent,
    PrivacyPolicyComponent,
    HelpComponent,
    BoardComponent,
    AddTaskViewComponent,
    SummaryComponent,
  ],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss',
})
/**
 * MainContentComponent
 *
 * The primary container for the main app views. Manages navigation between
 * Summary, Board, Contacts, and other sub-components. Also displays modal
 * overlays for legal/privacy/help content.
 */
export class MainContentComponent {
  // #region ATTRIBUTES
  /**
   * The name of the currently active component shown in the main area.
   * Examples: 'summary', 'board', 'contacts', 'addtask'.
   * @default 'summary'
   */
  activeComponent: string = 'summary';

  /**
   * EventEmitter that signals when the user wants to switch from Add Task
   * view to the Board view.
   */
  @Output() SwitchAddTaskToBoard = new EventEmitter<string>();

  /**
   * Tracks the previously active component for back navigation.
   * @default 'summary'
   */
  private componentHistory: string = 'summary';
  // #endregion

  constructor(private selectService: SelectContactService) {}

  // #region METHODS
  /**
   * Switches the active component in the main content area.
   * If switching to 'contacts', resets the contact selection.
   * Uses a microtask to ensure proper re-rendering when switching away from 'contacts'.
   *
   * @param {string} component - The name of the component to activate
   * @returns {void}
   */
  switchComponent(component: string): void {
    this.componentHistory = this.activeComponent;

    if (component === 'contacts') {
      this.selectService.backToContactsList();
    }

    if (this.activeComponent === 'contacts') {
      this.activeComponent = '';
      queueMicrotask(() => (this.activeComponent = component));
    } else {
      this.activeComponent = component;
    }
  }

  /**
   * Navigates back to the previously active component.
   * Defaults to 'summary' if no previous component is recorded.
   *
   * @returns {void}
   */
  backToPreviousComponent(): void {
    if (this.componentHistory) {
      this.activeComponent = this.componentHistory;
    } else {
      this.activeComponent = 'summary';
    }
  }
  // #endregion
}
