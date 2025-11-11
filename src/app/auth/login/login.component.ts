import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { FormsModule } from '@angular/forms';
import { A11yModule } from '@angular/cdk/a11y';
import { ToastMessageComponent } from '../../shared/components/toast-message/toast-message.component';
import { ToastMessagesService } from '../../shared/services/toast-messages.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    A11yModule,
    ToastMessageComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
/**
 * LoginComponent
 *
 * Standalone component that provides the login UI and handles user authentication
 * interactions such as signing in with email/password, signing in as a guest,
 * and persisting login input in sessionStorage.
 *
 * Public properties:
 * - email: string - bound to the email input field
 * - password: string - bound to the password input field
 * - authError: string | null - holds an authentication error message to show in the UI
 * - isSubmitting: boolean - true while an auth request is in progress
 * - hidePassword: boolean - controls password visibility in the UI
 * - showLogin: boolean - controls whether the login card is visible after animation
 *
 * Public methods:
 * - login(): Promise-like method that triggers sign-in with provided credentials
 * - loginGuest(): signs in with a predefined guest account
 * - goToApp(): navigates to the main application route on success
 * - goToLegalAndPrivacy(): navigates to the legal & privacy page
 * - loadInputFromSessionStorage(): restores saved inputs from sessionStorage
 * - onEmailChange(value): saves email to sessionStorage
 * - onPasswordChange(value): saves password to sessionStorage
 * - clearAuthError(): clears any displayed authentication errors
 */
export class LoginComponent {
  // #region ATTRIBUTES
  /**
   * The email address entered by the user. Bound to the email input field.
   * @default ''
   */
  email: string = '';

  /**
   * The password entered by the user. Bound to the password input field.
   * @default ''
   */
  password: string = '';

  /**
   * Holds a user-facing authentication error message when login fails.
   * Can be null when there is no error to display.
   */
  authError: string | null = null;

  /**
   * True while an authentication request is in progress; used to disable
   * inputs and show loading UI.
   */
  isSubmitting = false;

  /**
   * Controls password visibility in the UI. When true the password is hidden.
   * @default true
   */
  hidePassword: boolean = true;

  /**
   * Controls whether the login card is visible after the intro animation.
   * @default false
   */
  showLogin: boolean = false;
  // #endregion

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastService: ToastMessagesService
  ) {}

  // #region METHODS
  // #region______________ AUTH-HANDLING & ROUTING ______________
  /**
   * Attempt to sign in using the current `email` and `password` values.
   * Shows a submitting state while the request is in progress. On success
   * it navigates to the main app after a short delay. On failure it sets
   * `authError` to a user-friendly message.
   *
   * @returns {void} This method triggers async auth work but does not return a Promise.
   */
  login(): void {
    this.authError = null;
    this.isSubmitting = true;
    this.authService
      .login(this.email, this.password)
      .then((userCredential) => {
        // this.authService.currentUser = userCredential.user;
        setTimeout(() => this.goToApp(), 3000);
        this.isSubmitting = false;

        try {
          sessionStorage.removeItem('loginPW');
        } catch {}
      })
      .catch((error) => {
        this.authError = 'Check your email and password. Please try again.';
        this.isSubmitting = false;
      });
  }

  /**
   * Sign in using a predefined guest account. This mirrors `login()` but
   * uses a fixed guest email/password and also sets `isSubmitting` while
   * the request runs.
   *
   * @returns {void}
   */
  loginGuest(): void {
    const mail = 'gast@email.de';
    const pw = '0123456';
    this.authError = null;
    this.isSubmitting = true;
    this.authService
      .login(mail, pw)
      .then((userCredential) => {
        // this.authService.currentUser = userCredential.user;
        setTimeout(() => this.goToApp(), 3000);
        this.isSubmitting = false;
      })
      .catch((error) => {
        this.authError = 'Check your email and password. Please try again.';
        this.isSubmitting = false;
      });
  }

  /**
   * Navigate to the main application route.
   *
   * @returns {void}
   */
  goToApp(): void {
    this.router.navigateByUrl('/main');
  }

  /**
   * Navigate to the legal and privacy information page.
   *
   * @returns {void}
   */
  goToLegalAndPrivacy(): void {
    this.router.navigateByUrl('/legalAndPrivacy');
  }
  // #endregion______________ AUTH-HANDLING & ROUTING ______________

  //#region______________ SESSION-STORAGE ______________
  /**
   * Component init lifecycle hook. Restores saved login inputs.
   *
   * @returns {void}
   */
  ngOnInit(): void {
    this.loadInputFromSessionStorage();
  }

  /**
   * Restore previously saved login inputs from sessionStorage. If saved
   * values exist they are parsed and assigned to `email` and `password`.
   *
   * @returns {void}
   */
  loadInputFromSessionStorage(): void {
    const savedEmail = sessionStorage.getItem('loginEmail');
    if (savedEmail) {
      this.email = JSON.parse(savedEmail);
    }
    const savedPw = sessionStorage.getItem('loginPW');
    if (savedPw) {
      this.password = JSON.parse(savedPw);
    }
  }

  /**
   * Handler for email input changes. Updates the local `email` model
   * and persists it to sessionStorage so the field can be restored later.
   *
   * @param {string} value - The new email value from the input
   * @returns {void}
   */
  onEmailChange(value: string): void {
    this.email = value;
    sessionStorage.setItem('loginEmail', JSON.stringify(this.email));
  }

  /**
   * Handler for password input changes. Updates the local `password` model
   * and persists it to sessionStorage. Note: storing passwords in
   * sessionStorage is generally discouraged in production apps.
   *
   * @param {string} value - The new password value from the input
   * @returns {void}
   */
  onPasswordChange(value: string): void {
    this.password = value;
    sessionStorage.setItem('loginPW', JSON.stringify(this.password));
  }
  //#endregion______________ SESSION-STORAGE ______________

  //______________ ERROR-HANDLING ______________
  /**
   * Clear any authentication error message currently shown in the UI.
   *
   * @returns {void}
   */
  clearAuthError(): void {
    if (this.authError) this.authError = null;
  }

  //______________ LOGO-ANIMATION ______________
  /**
   * Triggered after the initial logo animation completes. Sets the
   * `showLogin` flag so the login card becomes visible.
   *
   * @param {AnimationEvent} _event - The animation event (unused)
   * @returns {void}
   */
  showLoginCardAfterAnimation(_event: AnimationEvent): void {
    this.showLogin = true;
  }
  // #endregion
}
