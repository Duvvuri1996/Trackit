import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { IssueCreateComponent } from './issue-create/issue-create.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { IssueEditComponent } from './issue-edit/issue-edit.component';
import { IssueViewComponent } from './issue-view/issue-view.component';




@NgModule({
  declarations: [IssueCreateComponent, UserDashboardComponent, IssueEditComponent, IssueViewComponent],
  imports: [
    CommonModule,
    RouterModule.forChild ([
      {path : 'userdashboard', component : UserDashboardComponent},
      {path : 'create', component : IssueCreateComponent},
      {path : 'edit/:issueId', component : IssueEditComponent},
      {path : 'view/:issueId', component : IssueCreateComponent}
    ])
  ]
})
export class DashboardModule { }
