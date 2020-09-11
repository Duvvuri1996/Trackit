import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ToastrModule } from 'ng6-toastr-notifications';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserModule } from '../app/user/user.module';
import { DashboardModule } from '../app/dashboard/dashboard.module';
import { SigninComponent } from '../app/user/signin/signin.component';
import { AppService } from '../app/app.service';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PageNotFoundComponent } from '../app/page-not-found/page-not-found.component';
import { ServerErrorComponent } from './server-error/server-error.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    ServerErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    DashboardModule,
    ToastrModule.forRoot(),
    UserModule,
    BrowserAnimationsModule,
    AngularFontAwesomeModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path : 'signin', component : SigninComponent, pathMatch : 'full' },
      { path : '', redirectTo : '/signin', pathMatch : 'full' },
      { path : '*', component : PageNotFoundComponent },
      { path : '**', component : PageNotFoundComponent },
      { path : 'servererror', component : ServerErrorComponent }
    ])
  ],
  providers: [AppService],
  bootstrap: [AppComponent],
  exports : [RouterModule]
})
export class AppModule { }
