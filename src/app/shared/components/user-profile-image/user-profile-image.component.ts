import { Component, inject, Input } from '@angular/core';
// import { CommonModule, NgStyle } from "../../../../../node_modules/@angular/common/common_module.d-NEF7UaHr";
import { FirebaseServiceService } from '../../services/firebase.service';
import { UserProfileImageService } from '../../services/user-profile-image.service';
import { Contact } from '../../interfaces/contact';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile-image.component.html',
  styleUrl: './user-profile-image.component.scss'
})
/**
 * UserProfileImageComponent
 *
 * Displays a user or contact profile image with initials.
 * Receives contact data and renders an avatar using the UserProfileImageService.
 */
export class UserProfileImageComponent {
  // #region ATTRIBUTES
  /**
   * Service that manages user profile image rendering and styling.
   */
  userProfImgService = inject(UserProfileImageService);

  /**
   * Service for accessing and managing contact data from Firestore.
   */
  contactService = inject(FirebaseServiceService);

  /**
   * The contact object to display. Contains name, email, phone, and styling info.
   */
  @Input() contact!: Contact;
  // #endregion
}
