import { Component } from '@angular/core';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ToastMessageComponent } from '../../shared/components/toast-message/toast-message.component';

@Component({
  selector: 'app-signup',
  imports: [FooterComponent, ToastMessageComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

}
