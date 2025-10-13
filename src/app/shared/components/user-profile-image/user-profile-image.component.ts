import { Component, inject, Input } from '@angular/core';
// import { CommonModule, NgStyle } from "../../../../../node_modules/@angular/common/common_module.d-NEF7UaHr";
import { FirebaseServiceService } from '../../services/firebase.service';
import { UserProfileImageService } from '../../services/user-profile-image.service';
import { Contact } from '../../interfaces/contact';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile-image',
  imports: [CommonModule],
  templateUrl: './user-profile-image.component.html',
  styleUrl: './user-profile-image.component.scss'
})
export class UserProfileImageComponent {
  // #region ATTRIBUTES
  userProfImgService = inject(UserProfileImageService);
  contactService = inject(FirebaseServiceService);
  @Input() contact!:Contact;
  // #endregion
}
