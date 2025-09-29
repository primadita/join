import { Component } from '@angular/core';
import { ContactsComponent } from './contacts/contacts.component';
import { NavBarComponent } from '../shared/components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-main-content',
  imports: [ContactsComponent, NavBarComponent],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss'
})
export class MainContentComponent {

}
