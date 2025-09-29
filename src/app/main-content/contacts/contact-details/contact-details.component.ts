import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SectionTitleVLineComponent } from '../../../shared/components/section-title-vline/section-title-vline.component';
import { UserProfileImageComponent } from '../../../shared/components/user-profile-image/user-profile-image.component';

@Component({
  selector: 'app-contact-details',
  imports: [CommonModule, SectionTitleVLineComponent, UserProfileImageComponent],
  templateUrl: './contact-details.component.html',
  styleUrl: './contact-details.component.scss'
})
export class ContactDetailsComponent {

}
