import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainContentComponent } from './main-content.component';

@Component({
  selector: 'app-main-shell',
  standalone: true,
  imports: [CommonModule, MainContentComponent],
  template: `<app-main-content></app-main-content>`,
})
export class MainShellComponent {}

