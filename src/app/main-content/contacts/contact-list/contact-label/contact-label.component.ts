import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-contact-label',
  imports: [],
  templateUrl: './contact-label.component.html',
  styleUrl: './contact-label.component.scss',
})
export class ContactLabelComponent {
  @Input() user: any;
}
