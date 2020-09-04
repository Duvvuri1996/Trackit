import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SocialLoginComponent } from './social-login/social-login.component';



@NgModule({
  declarations: [SignupComponent, SigninComponent, ResetPasswordComponent, SocialLoginComponent],
  imports: [
    CommonModule
  ]
})
export class UserModule { }
