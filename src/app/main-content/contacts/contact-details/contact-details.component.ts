import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { SectionTitleVLineComponent } from '../../../shared/components/section-title-vline/section-title-vline.component';
import { UserProfileImageComponent } from '../../../shared/components/user-profile-image/user-profile-image.component';
import { SectionHeaderService } from '../../../shared/services/section-header.service';
import { FirebaseServiceService } from '../../../shared/services/firebase.service';
import { UserProfileImageService } from '../../../shared/services/user-profile-image.service';
import { Contact } from '../../../shared/interfaces/contact';
import { FormsModule } from '@angular/forms';
import { EditContactComponent } from '../edit-contact/edit-contact.component';

@Component({
  selector: 'app-contact-details',
  imports: [
    CommonModule,
    SectionTitleVLineComponent,
    EditContactComponent,
    UserProfileImageComponent,
    FormsModule,
  ],
  templateUrl: './contact-details.component.html',
  styleUrl: './contact-details.component.scss',
})
export class ContactDetailsComponent {
  // #region ATTRIBUTES
  sectionHeaderList = inject(SectionHeaderService);
  contacts = this.sectionHeaderList.sectionHeader.find(
    (e) => e.title === 'Contacts'
  );

  contactFirebase = inject(FirebaseServiceService);
  userProfileService = inject(UserProfileImageService);
  edit: boolean = false;

  @Input() contact: Contact | null = null;
  @Output() back = new EventEmitter<void>();

  // #endregion

  // #region METHODS
  toggleEditContacWindow() {
    this.edit = !this.edit;
  }

  deleteContact(id: string) {
    this.contactFirebase.deleteContact(id);
  }

  backToContactsList() {
    this.back.emit();
  }

  // #endregion
}
