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
import { FileUploadModule } from 'ng2-file-upload';
import { NgxPaginationModule } from 'ngx-pagination';
import { TableFilterPipe } from '.././table-filter.pipe';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [TableFilterPipe,IssueCreateComponent, UserDashboardComponent, IssueEditComponent, IssueViewComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    BrowserModule,
    FileUploadModule,
    AngularEditorModule,
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatSelectModule,
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
