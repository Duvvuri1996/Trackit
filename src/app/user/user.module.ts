import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RecoveryMailComponent } from './recovery-mail/recovery-mail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ng6-toastr-notifications';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [SignupComponent, SigninComponent, ResetPasswordComponent, RecoveryMailComponent],
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    BrowserModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    RouterModule.forChild ([
      {path : 'signup', component : SignupComponent },
      {path : 'recoverymail', component : RecoveryMailComponent},
      {path : 'resetpassword/:recoveryToken', component : ResetPasswordComponent}
    ])
  ]
})
export class UserModule { }
