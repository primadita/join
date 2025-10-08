import { Component } from '@angular/core';
import { ContactsComponent } from './contacts/contacts.component';
import { NavBarComponent } from '../shared/components/nav-bar/nav-bar.component';
import { HeaderComponent } from '../shared/components/header/header.component';
import { LegalNoticeComponent } from '../shared/components/legal-notice/legal-notice.component';
import { PrivacyPolicyComponent } from '../shared/components/privacy-policy/privacy-policy.component';
import { HelpComponent } from '../shared/components/help/help.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-content',
  imports: [CommonModule, ContactsComponent, NavBarComponent, HeaderComponent, LegalNoticeComponent, PrivacyPolicyComponent, HelpComponent],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss'
})
export class MainContentComponent {
  // #region ATTRIBUTES
  /**
   * Currently active component name.
   * @default 'contacts'
   */
  activeComponent:string = 'contacts' //default
  // #endregion

  // #region METHODS
  /**
   * Switches the active component.
   * @param {string} component - The name of the component to activate.
   */
  switchComponent(component: string){
    this.activeComponent = component;
  }
  // #endregion
}
