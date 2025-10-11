import { Component, NgModule } from '@angular/core';
import { ContactsComponent } from './contacts/contacts.component';
import { NavBarComponent } from '../shared/components/nav-bar/nav-bar.component';
import { HeaderComponent } from '../shared/components/header/header.component';
import { LegalNoticeComponent } from '../shared/components/legal-notice/legal-notice.component';
import { PrivacyPolicyComponent } from '../shared/components/privacy-policy/privacy-policy.component';
import { HelpComponent } from '../shared/components/help/help.component';
import { CommonModule } from '@angular/common';
import { SelectContactService } from '../shared/services/select-contact.service';

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

  constructor (private selectService: SelectContactService){}
  // #region METHODS
  /**
   * Switches the active component in the main content area.
   * If switching to 'contacts', resets the contact selection.
   * Uses a microtask to ensure proper re-rendering when switching away from 'contacts'.
   * @param component The name of the component to activate.
   */
  switchComponent(component: string){
    
    if(component === 'contacts'){
      this.selectService.backToContactsList();
    }

    if(this.activeComponent === 'contacts'){
      this.activeComponent = '';
      queueMicrotask(() => this.activeComponent = component);
    } else {
      this.activeComponent = component;
    }
    
  }
  // #endregion
}
