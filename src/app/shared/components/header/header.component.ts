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
/**
 * HeaderComponent
 *
 * Standalone header/navigation component. It tracks the navbar visibility,
 * subscribes to the auth state to show user information (name and initials),
 * and emits a navigation/help event when a help or target component should be shown.
 *
 * Public properties:
 * - navActive: boolean - whether the navigation bar is open
 * - authService: injected AuthService instance used to observe auth state
 * - userName: string | null | undefined - display name of the current user
 * - userInitials: string - computed initials from the user name
 * - context: 'main' | 'login' - input to change header behavior based on page
 * - callHelpPage: EventEmitter<string> - emits when the header should request navigation to a help section
 *
 * Public methods:
 * - toggleNavbar(): toggles the navbar open/closed
 * - navigateToComponent(event, targetComponent): prevents default and emits the target
 * - getLetters(): computes initials from the user's name
 * - ngOnInit(): subscribes to auth state and updates user display info
 */
export class HeaderComponent {
  // #region ATTRIBUTES
  /**
   * Indicates whether the navigation bar is currently active (visible).
   * @default false
   */
  navActive: boolean = false;
  /**
   * Injected AuthService instance used to observe authentication state.
   */
  authService = inject(AuthService);

  /**
   * The display name of the currently signed-in user (from auth profile).
   * May be undefined/null when no user is signed in.
   */
  userName!: string | null | undefined;

  /**
   * Computed initials derived from `userName` for avatar display.
   */
  userInitials!: string;

  /**
   * Input that controls header behavior for different pages. Use 'login'
   * to render a simplified header on the login page.
   * @default 'main'
   */
  @Input() context: 'main' | 'login' = 'main';

  /**
   * Emits when the header requests navigation to a help or target section.
   * The payload is the target component name.
   */
  @Output() callHelpPage = new EventEmitter<string>();
  // #endregion

  // #region METHODS
  /**
   * Toggles the navigation bar's active state.
   *
   * @returns {void}
   */
  toggleNavbar(): void {
    this.navActive = !this.navActive;
  }

  /**
   * Emits an event to navigate to a target component.
   *
   * @param {Event} event - The click event.
   * @param {string} targetComponent - The target component name.
   * @returns {void}
   */
  navigateToComponent(event: Event, targetComponent: string): void {
    event.preventDefault(); //avoid page reload
    this.callHelpPage.emit(targetComponent);
  }

  /**
   * Compute a 1- or 2-letter initials string from the user's display name.
   * Returns 'G' when no name is available (generic guest marker).
   *
   * @returns {string} computed initials (uppercase)
   */
  getLetters(): string {
    if (!this.userName) return 'G'; 
    const parts = this.userName.trim().split(' ');
    const first = parts[0]?.[0] || '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    const initials = (first + last).toUpperCase();
    return initials;
  }

  /**
   * Subscribe to auth state changes and update the display name and initials.
   *
   * @returns {void}
   */
  ngOnInit(): void {
    this.authService.currentUser.subscribe((user) => {
      this.userName = user?.displayName;
      this.userInitials = this.getLetters();
    });
  }
  // #endregion
}
