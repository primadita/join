import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  navActive:boolean = false;
  @Output() callHelpPage = new EventEmitter<string>();


  toggleNavbar():void{
    this.navActive = !this.navActive;
  }

  navigateToComponent(event: Event, targetComponent: string){
    event.preventDefault(); //avoid page reload
    this.callHelpPage.emit(targetComponent);
  }
}
