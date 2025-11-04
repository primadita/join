import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { OutletContext } from '@angular/router';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './help.component.html',
  styleUrl: './help.component.scss'
})
export class HelpComponent {
  @Output() back = new EventEmitter<void>;
}
