import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})

/**
 * Header component that manages the state of the navigation bar.
 */
export class HeaderComponent {

    /**
   * Indicates whether the navigation bar is currently active (visible).
   * @default false
   */
  navActive:boolean = false;
  
    /**
   * Toggles the navigation bar's active state.
   * - If `navActive` is `true`, it will be set to `false`.
   * - If `navActive` is `false`, it will be set to `true`.
   */
  toggleNavbar():void{
    this.navActive = !this.navActive;
  }
}
