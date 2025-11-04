import { Component, Input, Output } from '@angular/core';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ToastMessageComponent } from '../../shared/components/toast-message/toast-message.component';
import { FormsModule, NgForm } from '@angular/forms';
import { PatternValidatorDirective } from '../../shared/directives/pattern-validator.directive';
import { ToastMessagesService } from '../../shared/services/toast-messages.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, FooterComponent, ToastMessageComponent, FormsModule, PatternValidatorDirective],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  // #region ATTRIBUTES
  user = {
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  }
  hidePassword: boolean = true;
  passwordFocused: boolean = false;

  // #endregion

  constructor(private toastService: ToastMessagesService){}

  // #region METHODS
  get passwordsMatch(): boolean {
    return this.user.password === this.user.confirmPassword;
  }

  togglePasswordVisibility():void{
    this.hidePassword = !this.hidePassword;
    this.passwordFocused = true;
  }
  
  onSubmit(ngForm: NgForm){
    this.toastService.show('Sign up is successful',"success");
  }
  // #endregion
}
