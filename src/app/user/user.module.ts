import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RecoveryMailComponent } from './recovery-mail/recovery-mail.component';



@NgModule({
  declarations: [SignupComponent, SigninComponent, ResetPasswordComponent, RecoveryMailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild ([
      {path : 'signup', component : SignupComponent },
      {path : 'recoverymail', component : RecoveryMailComponent},
      {path : 'resetpassword/:recoveryToken', component : ResetPasswordComponent}
    ])
  ]
})
export class UserModule { }
