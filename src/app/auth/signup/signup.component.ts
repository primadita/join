import { Component } from '@angular/core';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ToastMessageComponent } from '../../shared/components/toast-message/toast-message.component';
import { FormsModule, NgForm } from '@angular/forms';
import { PatternValidatorDirective } from '../../shared/directives/pattern-validator.directive';
import { ToastMessagesService } from '../../shared/services/toast-messages.service';

@Component({
  selector: 'app-signup',
  imports: [FooterComponent, ToastMessageComponent, FormsModule, PatternValidatorDirective],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  // #region ATTRIBUTES
  user = {
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  }
  // #endregion

  constructor(private toastService: ToastMessagesService){}
  // #region METHODS
  get passwordsMatch(): boolean {
    return this.user.password === this.user.confirmPassword;
  }
  onSubmit(ngForm: NgForm){
    this.toastService.show('Sign up is successful',"success");
  }
  // #endregion
}
