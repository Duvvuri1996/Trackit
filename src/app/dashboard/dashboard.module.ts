import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { IssueCreateComponent } from './issue-create/issue-create.component'
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { IssueEditComponent } from './issue-edit/issue-edit.component';
import { IssueViewComponent } from '../../app/dashboard/issue-view/issue-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule  } from 'ng6-toastr-notifications';
import { AuthGuardService } from '../auth-guard.service';
import { DemoMaterialModule } from '../../app/material-module';
import { NgxEditorModule } from 'ngx-editor';
import { FileUploadModule } from 'ng2-file-upload';
import { NgxPaginationModule } from 'ngx-pagination';
import { TableFilterPipe } from '.././table-filter.pipe';

@NgModule({
  declarations: [TableFilterPipe,IssueCreateComponent, UserDashboardComponent, IssueEditComponent, IssueViewComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    BrowserModule,
    FileUploadModule,
    NgxEditorModule,
    NgxPaginationModule,
    DemoMaterialModule,
    ToastrModule.forRoot(),
    RouterModule.forChild ([
      { path : 'userdashboard', component : UserDashboardComponent, canActivate : [AuthGuardService] },
      { path : 'create', component : IssueCreateComponent, canActivate : [AuthGuardService] },
      { path : 'edit/:issueId', component : IssueEditComponent, canActivate : [AuthGuardService] },
      { path : 'issueView/:issueId', component : IssueViewComponent, canActivate : [AuthGuardService] }
    ])
  ],
  exports: [TableFilterPipe]
})
export class DashboardModule { }
