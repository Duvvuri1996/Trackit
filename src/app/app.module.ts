import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserModule } from '../app/user/user.module';
import { SigninComponent } from '../app/user/signin/signin.component';
import { AppService } from '../app/app.service';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PageNotFoundComponent } from '../app/page-not-found/page-not-found.component';
import { ServerErrorComponent } from './server-error/server-error.component';

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    PageNotFoundComponent,
    ServerErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    UserModule,
    RouterModule.forRoot([
      { path : 'signin', component : SigninComponent, pathMatch : 'full' },
      { path : '', redirectTo : '/signin', pathMatch : 'full' },
      { path : '*', component : PageNotFoundComponent },
      { path : '**', component : PageNotFoundComponent },
      { path : 'servererror', component : ServerErrorComponent }
    ]),
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
