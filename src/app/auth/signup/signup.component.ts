import { Component, Input, Output } from '@angular/core';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ToastMessageComponent } from '../../shared/components/toast-message/toast-message.component';
import { FormsModule, NgForm } from '@angular/forms';
import { PatternValidatorDirective } from '../../shared/directives/pattern-validator.directive';
import { ToastMessagesService } from '../../shared/services/toast-messages.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { FirebaseServiceService } from '../../shared/services/firebase.service';
import { Contact } from '../../shared/interfaces/contact';
import { UserProfileImageService } from '../../shared/services/user-profile-image.service';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, FooterComponent, ToastMessageComponent, FormsModule, PatternValidatorDirective, RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
/**
 * SignupComponent
 *
 * Component used for user registration. Collects user details, validates
 * passwords, persists partial input in sessionStorage, and coordinates
 * creation of an initial contact entry after successful signup.
 *
 * Public properties:
 * - user: object - holds name, email, phone and password entered by the user
 * - confirmPassword: string - re-typed password for confirmation
 * - hidePasswordA / hidePasswordB: boolean - toggles for password visibility
 * - passwordAFocused / passwordBFocused: boolean - UI focus flags used for styling
 * - privacyPolicyCheck: boolean - whether the user agreed to privacy policy
 *
 * Public methods:
 * - passwordsMatch: getter that returns true when passwords match
 * - togglePasswordVisibility(field): toggles visibility for password fields
 * - saveInputs(): persists form inputs to sessionStorage
 * - loadInputFromSessionStorage(): restores form inputs
 * - createContact(): builds a Contact object for initial user contact entry
 * - addContact(): async helper that adds the created Contact to the DB
 * - onSignUp(form): calls auth service to register the user and handles UI feedback
 */
export class SignupComponent {
  // #region ATTRIBUTES
  /**
   * The input model for the signup form. Contains basic profile and
   * credential fields collected from the user.
   *
   * Properties:
   * - name: string
   * - email: string
   * - phone: string
   * - password: string
   */
  user = {
    name: "",
    email: "",
    phone: "",
    password: "",
  };

  /**
   * The confirmation password entered by the user (re-type).
   */
  confirmPassword: string = "";

  /**
   * Controls visibility of the primary password field. When true the
   * input is hidden (password dots).
   */
  hidePasswordA: boolean = true;

  /**
   * Controls visibility of the confirmation password field.
   */
  hidePasswordB: boolean = true;

  /**
   * UI flag used to mark that the primary password field received focus
   * (used for styling / helper hints).
   */
  passwordAFocused: boolean = false;

  /**
   * UI flag used to mark that the confirmation password field received focus.
   */
  passwordBFocused: boolean = false;

  /**
   * Whether the user checked the privacy policy checkbox. Persisted to
   * sessionStorage while signing up.
   */
  privacyPolicyCheck: boolean = false;
  // #endregion

  constructor(private toastService: ToastMessagesService,private router: Router, private authService: AuthService, private contactService: FirebaseServiceService, private userProfileService: UserProfileImageService){}

  // #region METHODS
  /**
   * Component init lifecycle hook. Restores any saved signup inputs from sessionStorage.
   *
   * @returns {void}
   */
  ngOnInit(): void {
    this.loadInputFromSessionStorage();
  }

  /**
   * Whether the entered password and the confirmation password match.
   *
   * @returns {boolean} true when both password fields are identical
   */
  get passwordsMatch(): boolean {
    return this.user.password === this.confirmPassword;
  }

  /**
   * Toggle visibility for one of the password fields and mark it focused
   * so UI helpers can show the appropriate state.
   *
   * @param {string} passwordField - 'A' for the primary password, 'B' for confirmation
   * @returns {void}
   */
  togglePasswordVisibility(passwordField: string): void {
    if (passwordField === 'A') {
      this.hidePasswordA = !this.hidePasswordA;
      this.passwordAFocused = true;
    } else if (passwordField === 'B') {
      this.hidePasswordB = !this.hidePasswordB;
      this.passwordBFocused = true;
    }
  }
  
  /**
   * Persist the current signup inputs to sessionStorage so the user can
   * return to the form without losing typed data.
   *
   * @returns {void}
   */
  saveInputs(): void {
    sessionStorage.setItem('signUpData', JSON.stringify(this.user));
    sessionStorage.setItem('retypePassword', JSON.stringify(this.confirmPassword));
    sessionStorage.setItem('privacyPolicyChecked', JSON.stringify(this.privacyPolicyCheck));
  }

  /**
   * Restore saved signup inputs from sessionStorage into the component model.
   *
   * @returns {void}
   */
  loadInputFromSessionStorage(): void {
    const savedData = sessionStorage.getItem('signUpData');
    const savedConfirmPassword = sessionStorage.getItem('retypePassword');
    const savedPrivacy = sessionStorage.getItem('privacyPolicyChecked');
    if (savedData) {
      this.user = JSON.parse(savedData);
    }
    if (savedConfirmPassword) {
      this.confirmPassword = JSON.parse(savedConfirmPassword);
    }
    if (savedPrivacy) {
      this.privacyPolicyCheck = JSON.parse(savedPrivacy);
    }
  }

  /**
   * Create a Contact object populated from the current user inputs. This
   * is used to create an initial contact entry for the new user.
   *
   * @returns {Contact} the newly created Contact object (not yet persisted)
   */
  createContact(): Contact {
    let contact: Contact = {
      name: this.user.name,
      mail: this.user.email,
      phone: this.user.phone,
      id: '',
      bgColor: this.userProfileService.getBackgroundColor(this.contactService.getContactsLength()),
    };
    return contact;
  }

  /**
   * Persist the Contact created from the current inputs.
   *
   * @returns {Promise<void>} resolves when the contact has been added
   */
  async addContact(): Promise<void> {
    const contact = this.createContact();
    await this.contactService.addContact(contact);
  }

  /**
   * Navigate to the main application page.
   *
   * @returns {void}
   */
  goToMainPage(): void {
    this.router.navigateByUrl('/main');
  }

  /**
   * Handle the signup form submission. Calls the AuthService to create a
   * new user with email and password, creates an initial Contact, updates
   * the display name and provides UI feedback via toasts.
   *
   * @param {NgForm} ngForm - the Angular form reference for resetting on success
   * @returns {void}
   */
  onSignUp(ngForm: NgForm): void {
    this.authService
      .createUserWithEmailAndPassword(this.user.email, this.user.password)
      .then((userCredential) => {
        const user = userCredential.user;
        this.addContact();
        this.authService.addProfileName(this.user.name);
        // this.authService.currentUser = userCredential.user;
        this.toastService.show('Sign up is successful', 'success');
        setTimeout(() => {
          this.goToMainPage();
          ngForm.resetForm();
          sessionStorage.clear();
        }, 3000);
        ;
      })
      .catch((error) => {
        this.toastService.show(error.message, 'error');
      });
  }
  // #endregion
}
