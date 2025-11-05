import { Component, Input, Output } from '@angular/core';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ToastMessageComponent } from '../../shared/components/toast-message/toast-message.component';
import { FormsModule, NgForm } from '@angular/forms';
import { PatternValidatorDirective } from '../../shared/directives/pattern-validator.directive';
import { ToastMessagesService } from '../../shared/services/toast-messages.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, FooterComponent, ToastMessageComponent, FormsModule, PatternValidatorDirective, RouterModule],
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
  }
  confirmPassword: string = "";
  hidePasswordA: boolean = true;
  hidePasswordB: boolean = true;
  passwordAFocused: boolean = false;
  passwordBFocused: boolean = false;
  privacyPolicyCheck: boolean = false;
  // #endregion

  constructor(private toastService: ToastMessagesService, router: Router){}

  // #region METHODS
  ngOnInit():void{
    this.loadInputFromSessionStorage();
  }

  get passwordsMatch(): boolean {
    return this.user.password === this.confirmPassword;
  }

  togglePasswordVisibility(passwordField: string):void{ 
    if(passwordField === 'A'){
      this.hidePasswordA = !this.hidePasswordA;
      this.passwordAFocused = true;
    } else if(passwordField === 'B'){
      this.hidePasswordB = !this.hidePasswordB;
      this.passwordBFocused = true;
    }
  }
  
  saveInputs(){
    sessionStorage.setItem('signUpData',JSON.stringify(this.user));
    sessionStorage.setItem('retypePassword', JSON.stringify(this.confirmPassword));
    sessionStorage.setItem('privacyPolicyChecked', JSON.stringify(this.privacyPolicyCheck));
  }

  loadInputFromSessionStorage(){
    const savedData = sessionStorage.getItem('signUpData');
    const savedConfirmPassword = sessionStorage.getItem('retypePassword');
    const savedPrivacy = sessionStorage.getItem('privacyPolicyChecked');
    if(savedData){
      this.user = JSON.parse(savedData);
    }
    if(savedConfirmPassword){
      this.confirmPassword = JSON.parse(savedConfirmPassword);
    }
    if(savedPrivacy){
      this.privacyPolicyCheck = JSON.parse(savedPrivacy);
    }
  }

  onSubmit(ngForm: NgForm){
    this.toastService.show('Sign up is successful',"success");
    ngForm.resetForm();
    sessionStorage.clear();
    
  }
  // #endregion
}
