import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {

  public allIssues : any[] = [];
  public singleIssue : any;
  public userId : any;
  public userName : any;
  public searchData : any[] = [];
  public days : any;
  public fullName : any[] = [];
  public firstChar : any;
  public selectedUser : any;
  public backLogs = [];
  public inProgress = [];
  public inTest = [];
  public done = [];
  public watchDetails = [];
  public authToken : any;

  constructor(public router : Router, public appService : AppService, public toastr : ToastrManager) { }

  ngOnInit(): void {
    this.getAllIssues();
    //this.getSingleUserIssue();
    this.getAllUsers();
    this.socialUsers();
    //this.searchIssue();
    this.numOfDays();
    this.authToken = Cookie.get('authToken');
    this.userName = Cookie.get('receiverName');
    this.userId = Cookie.get('receiverId');
    this.firstChar = this.userName.slice(0,1);
  }
  public getAllUsers: any = () => {
    this.appService.allUsers().subscribe((apiResponse) => {
      if(apiResponse.status === 200) {
        let allUsersData = apiResponse.data;
        let name;
        for(let x of allUsersData){
           name = allUsersData.fullName;
        }
        this.fullName.push(name)
      }
    })
  }

  public socialUsers:  any = () => {
    this.appService.socialUsers().subscribe((apiResponse) => {
      if(apiResponse.status === 200) {
        let allUsersData = apiResponse.data;
        let name;
        for(let x of allUsersData){
           name = `${allUsersData.firstName} ${allUsersData.lastName}`
        }
        this.fullName.push(name)
      }
    })
  }

  public getAllIssues: any =() => {
    this.appService.getAllIssues().subscribe((apiResponse) => {
      if(apiResponse.status === 200) {
        this.allIssues = apiResponse.data;
        for (let data of this.allIssues) {
          switch (data.status) {
            case 'Backlog' : 
            this.backLogs.push(data);
            break;
            case 'In-progress' : 
            this.inProgress.push(data);
            break;
            case 'In-Test' :
            this.inTest.push(data);
            break;
            case 'Done' :
            this.done.push(data);
            break;
          }
        }
      } else {
        this.toastr.warningToastr('No issues to view')
      }
    })
  }

  public numOfDays: any = (issueId) => {
    this.appService.numOfDays(issueId).subscribe((apiResponse) => {
      if(apiResponse.status === 200) {
        this.days = apiResponse.data
      }
    })
  }

  public searchIssue: any =(search) => {
    let data = {
      search : search
    }
    this.appService.searchIssue(data).subscribe((apiResponse) => {
      if(apiResponse.status === 200) {
        this.searchData = apiResponse.data
      }
    })
  }

  public goToIssuesCreate (): any {
    this.router.navigate(['/create'])
  }

  public logout = () => {
    //let token = this.appService.getUserInfoInLocalStorage().authToken
    if(this.authToken !== undefined) {
      this.appService.logout().subscribe((apiResponse) => {
        if(apiResponse.status === 200) {
          Cookie.delete('userId')
          Cookie.delete('userName')
          Cookie.delete('authToken')
          localStorage.clear()
          this.router.navigate(['/signin'])
        }
      })
    } else {
      this.appService.logoutSoicalUser().subscribe((apiResponse) => {
        if(apiResponse.status === 200) {
          Cookie.delete('userId')
          Cookie.delete('userName')
          this.router.navigate(['/signin'])
        }
      })
    }
  }
  public getWatchList = () => {
    this.appService.watchOfUser(this.userId).subscribe((apiResponse) => {
      if(apiResponse.status === 200) {
        let details = apiResponse.userWatchDetails;
        for(let x of details) {
          this.watchDetails.push(x.issueTitle)
        }
      }
      else {
        this.toastr.warningToastr('No watch list')
      }
    })
  }
}