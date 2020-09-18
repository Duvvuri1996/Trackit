import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { HttpClient } from '@angular/common/http';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { IssueDetails } from './issueDetails';
import { ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import{ Location } from '@angular/common';
import { TableFilterPipe } from '../../table-filter.pipe';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})


export class UserDashboardComponent implements OnInit{

  p: number = 1;
  @ViewChild(MatPaginator) matPaginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;

  
  public allIssues: any[]  = [];
  public singleIssue : any;
  public userId : any;
  public userName : any;
  public days : any;
  public searchData : any[] = [];
  public fullName : any[] = [];
  public firstChar : any;
  public selectedUser : any;
  public backLogs = [];
  public inProgress = [];
  public inTest = [];
  public done = [];
  public watchDetails = [];
  public authToken : any;
  public notifications = [];
  public count = [];
  public notifyData = [];
  public notify: boolean = false;
  public search : String;
  public countIssue : number;
  public toggler : boolean = true;
  public length : number;
  public allData;
  public watchToggle : boolean = false;
  public issueId : String;

  constructor( public location : Location, public router : Router, public appService : AppService, public toastr : ToastrManager, public http: HttpClient) { }

  ngOnInit(): void {
  
    this.authToken = Cookie.get('authToken');
    this.userName = Cookie.get('receiverName');
    this.userId = Cookie.get('receiverId');
    this.firstChar = this.userName[0];
    this.getAllUsers();
    this.socialUsers();
    this.notifyCount();
    this.getNotification();
    this.getAllIssues();                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
  }

  ngDoCheck() {}

  public compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  public compareDate(a: number | string, b: number | string, isAsc: boolean){
    let c = new Date(a)
    let d = new Date(b)
    
    return (c < d ? -1 : 1) * (isAsc ? 1 : -1);
  }

  sortData(sort : MatSort){
    const data = this.searchData.slice()
    if (!sort.active || sort.direction === '') {
      this.searchData = data;
      return;
    }
    this.searchData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'issueTitle': return this.compare(a.issueTitle, b.issueTitle, isAsc);
        case 'userName': return this.compare(a.userName, b.userName, isAsc);
        case 'createdOn': return this.compareDate(a.createdOn, b.createdOn, isAsc);
        case 'status': return this.compare(a.status, b.status, isAsc);
        default: return 0;
      }
    });
  }

  sortDataIssues(sort : MatSort){
    const data = this.allIssues.slice()
    if (!sort.active || sort.direction === '') {
      this.allIssues = data;
      return;
    }
    this.allIssues = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'issueTitle': return this.compare(a.issueTitle, b.issueTitle, isAsc);
        case 'userName': return this.compare(a.userName, b.userName, isAsc);
        case 'createdOn': return this.compareDate(a.createdOn, b.createdOn, isAsc);
        case 'status': return this.compare(a.status, b.status, isAsc);
        default: return 0;
      }
    });
  }
  
  sortDataWatch(sort : MatSort){
    const data = this.watchDetails.slice()
    if (!sort.active || sort.direction === '') {
      this.watchDetails = data;
      return;
    }
    this.watchDetails = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'issueTitle': return this.compare(a.issueTitle, b.issueTitle, isAsc);
        case 'userName': return this.compare(a.userName, b.userName, isAsc);
        case 'createdOn': return this.compareDate(a.createdOn, b.createdOn, isAsc);
        case 'status': return this.compare(a.status, b.status, isAsc);
        default: return 0;
      }
    });
  }

  public getIssuesCount = () => {
    this.appService.getAllIssuesCount().subscribe((apiResponse) => {
      this.countIssue = apiResponse.data
      console.log(apiResponse.data)
    })
  }
 public goToCreateDashboard () {
   this.router.navigate(['/create'])
 }

 public goToViewDashboard (issueId) {
  
   this.router.navigate(['/issueView/', issueId])
   console.log(issueId)
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
        let allData = []
        allData = apiResponse.data
        //console.log(allData)
        for(var x of allData){
          //console.log(x.issueId)
          if(x.assigneeId === this.userId){
            this.allIssues.push(x)
          }
          switch (x.status) {
            case 'Backlog' : 
            this.backLogs.push(x);
            break;
            case 'In-progress' : 
            this.inProgress.push(x);
            break;
            case 'In-Test' :
            this.inTest.push(x);
            break;
            case 'Done' :
            this.done.push(x);
            break;
           }
         }
        }
      },(error) => {
        this.toastr.warningToastr('No issues to view')
    })
    
  }
  
  public numOfDays: any = (issueId) => {
    this.appService.numOfDays(issueId).subscribe((apiResponse) => {
      if(apiResponse.status === 200) {
        this.days = apiResponse.data
      }
    })
  }

  public searchIssue: any =() => {
    let data = {
      search : this.search
    }
    this.appService.searchIssue(data).subscribe((apiResponse) => {
      if(apiResponse.status === 200) {
        this.search = ''
        this.searchData = apiResponse.data
        this.length = this.searchData.length
        console.log(this.searchData)
        return this.toggler = false
      } else {
        this.toastr.infoToastr('No result found')
      }
    })
  }

  public goToIssuesCreate (): any {
    this.router.navigate(['/create'])
  }

  public logout = () => {
    let token = this.authToken
    if(token === undefined || token === null || token === '') {
      this.appService.logoutSoicalUser().subscribe(() => {
        console.log('this function is called')
        Cookie.delete('receiverId', '/')
        Cookie.delete('receiverName', '/')
        localStorage.clear()
        this.router.navigate(['/signin'])
        
      })
    } else {
      this.appService.logout().subscribe((apiResponse) => {
        if(apiResponse.status === 200) {
          Cookie.deleteAll('receiverId')
          Cookie.deleteAll('receiverName')
          Cookie.deleteAll('authToken')
          localStorage.clear()
          this.router.navigate(['/signin'])
        }
        })
      }
  }

  public getWatchList = () => {
    this.watchToggle = true;

    this.appService.watchOfUser(this.userId).subscribe((apiResponse) => {
      if(apiResponse.status === 200) {
        console.log(apiResponse)
        let details = apiResponse.data;
        if(details.watchId === Cookie.get('receiverId')){
          for(let x of details) {
            if(this.allIssues !== null){
              for(let y of this.allIssues){
                if(x.issueId === y.issueId){
                  this.watchDetails.push(y)
                }
              }
              
            }
            
          }
        }
        
        console.log(this.watchDetails)
      }
      else {
        this.toastr.warningToastr('No watch list')
      }
    })
  }
  
  public back = () => {
    return ((this.toggler = true) && (this.watchToggle = false))
  }

  public getNotification = () => {
    this.appService.getAllNotifications().subscribe((apiResponse) => {
      this.notifications.push(apiResponse.data)
      //console.log(this.notifications)
      for(var x of this.notifications){
        if(x.userId === this.userId) {
          for(let y of x) {
            if(y.notificationCount === 1){
              this.count.push(y.notificationCount)
              for(let z of y.notificationDescription) {
                let id = y.issueId
                let des = z
                let data = {
                  issueId : id,
                  description : des
                }
                this.notifyData.push(data)
                console.log(this.notifyData)
              }
            } 
          }
        } else {
          if(this.count.length === 0) {
            return this.notify = true
          }
        }
      }
    })
  }

  public notifyCount = () =>{
    this.appService.notificationCount(this.userId).subscribe(
      (apiResponse)=>{
        if(apiResponse.status === 200){
          return this.notify = true
        }
      }
    )
  }
}