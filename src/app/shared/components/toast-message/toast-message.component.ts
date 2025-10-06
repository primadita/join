import { Component, inject } from '@angular/core';
import { ToastMessagesService } from '../../services/toast-messages.service';
import { CommonModule } from '@angular/common';
import { Messages } from '../../interfaces/messages';

@Component({
  selector: 'app-toast-message',
  imports: [CommonModule],
  templateUrl: './toast-message.component.html',
  styleUrl: './toast-message.component.scss'
})
export class ToastMessageComponent {
  message: Messages | null = null;

  constructor(private toastService: ToastMessagesService){}

  ngOnInit(){
    this.toastService.toastStatus.subscribe(msg => {
      this.message = msg;
      setTimeout(() => this.message = null, 3000);
    });
  }
}
