import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ToastrModule } from 'ng6-toastr-notifications';
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
//import { AngularFontAwesomeModule } from 'angular-font-awesome/dist/angular-font-awesome';
import { AuthGuardService } from './auth-guard.service';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {MatNativeDateModule} from '@angular/material/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import { DemoMaterialModule } from './material-module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { FileUploadModule } from 'ng2-file-upload';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    ServerErrorComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    DemoMaterialModule,
    MatNativeDateModule,
    DashboardModule,
    NgxPaginationModule,
    ToastrModule.forRoot(),
    UserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    FileUploadModule,
    ReactiveFormsModule,
    AngularEditorModule,
    RouterModule.forRoot([
      { path : 'signin', component : SigninComponent, pathMatch : 'full' },
      { path : '', redirectTo : '/signin', pathMatch : 'full' },
      { path : '*', component : PageNotFoundComponent },
      { path : '**', component : PageNotFoundComponent },
      { path : 'servererror', component : ServerErrorComponent }
    ])
  ],
  providers: [AppService, AuthGuardService,
  {
    provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' }
  }],
  bootstrap: [AppComponent],
  exports : [RouterModule]
})
export class AppModule { }
