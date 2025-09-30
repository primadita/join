import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SectionTitleVLineComponent } from '../../../shared/components/section-title-vline/section-title-vline.component';
import { UserProfileImageComponent } from '../../../shared/components/user-profile-image/user-profile-image.component';
import { SectionHeaderService } from '../../../shared/services/section-header.service';
import { FirebaseServiceService } from '../../../shared/services/firebase.service';
import { UserProfileImageService } from '../../../shared/services/user-profile-image.service';

@Component({
  selector: 'app-contact-details',
  imports: [CommonModule, SectionTitleVLineComponent, UserProfileImageComponent],
  templateUrl: './contact-details.component.html',
  styleUrl: './contact-details.component.scss'
})
export class ContactDetailsComponent {
  // #region ATTRIBUTES
  sectionHeaderList = inject(SectionHeaderService);
  contacts = this.sectionHeaderList.sectionHeader.find(e => e.title === 'Contacts');

  contactFirebase = inject(FirebaseServiceService);
  userProfileService = inject(UserProfileImageService);

  // #endregion

  // #region METHODS
  editContact(){

  }

  deleteContact(){
    
  }
  // #endregion
}
