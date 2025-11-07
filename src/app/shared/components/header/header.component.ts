import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-header',
  standalone: true,
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
  navActive: boolean = false;

  authService = inject(AuthService);
  userName = this.authService.currentUser?.displayName;
  userInitials = this.getLetters();

  @Input() context: 'main' | 'login' = 'main';
  /**
   * Emits event to call help page.
   */
  @Output() callHelpPage = new EventEmitter<string>();
  // #endregion

  // #region METHODS
  /**
   * Toggles the navigation bar's active state.
   */
  toggleNavbar(): void {
    this.navActive = !this.navActive;
  }

  /**
   * Emits an event to navigate to a target component.
   * @param {Event} event - The click event.
   * @param {string} targetComponent - The target component name.
   */
  navigateToComponent(event: Event, targetComponent: string) {
    event.preventDefault(); //avoid page reload
    this.callHelpPage.emit(targetComponent);
  }

  getLetters(): string {
    if (!this.userName) return ''; 
    const parts = this.userName.trim().split(' ');
    const first = parts[0]?.[0] || '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    const initials = (first + last).toUpperCase();
    return initials;
  }

  ngOnInit() {
    this.authService.getCurrentUser();
  }
  // #endregion
}
