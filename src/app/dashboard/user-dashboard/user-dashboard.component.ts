import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { HttpClient } from '@angular/common/http';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { IssueDetails } from './issueDetails';
import {  ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})


export class UserDashboardComponent implements OnInit{

  /**displayedColumns: string[] = ['Title', 'userName', 'Status', 'Date', 'Number'];
  issueDetails : Issues | null;
  pageSize : number;
  length : any;
  dataSource : IssueDetails[] = [];
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) matPaginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;**/

  public allIssues : any[] = [];
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
  public notifyData: any[] = [];
  notify: boolean = false;
  public search : String;
  public countIssue : number;

  constructor(public router : Router, public appService : AppService, public toastr : ToastrManager, public http: HttpClient) { }

  

  ngOnInit(): void {
    
    this.getAllIssues();
    //this.getSingleUserIssue();
    this.getAllUsers();
    this.socialUsers();
    //this.searchIssue();
    //this.numOfDays();
    this.getNotification();
    this.authToken = Cookie.get('authToken');
    this.userName = Cookie.get('receiverName');
    this.userId = Cookie.get('receiverId');
    this.firstChar = this.userName[0];                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
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
   this.router.navigate(['/view/', issueId])
 }
  /**ngAfterViewInit() {
    
    this.issueDetails = new Issues(this.http);
    this.matSort.sortChange.subscribe(() => this.matPaginator.pageIndex = 0)
    merge(this.matSort.sortChange, this.matPaginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.issueDetails.getIssues(
            this.matSort.active, this.matSort.direction, this.matPaginator.pageIndex);
        }),
        map(dataSource => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.length = dataSource.items.length

          console.log(this.length.data +" is this")
          return dataSource.items;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          // Catch if the GitHub API has reached its rate limit. Return empty data.
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe(dataSource => this.dataSource = dataSource);
  }**/
  

  public getAllUsers: any = () => {
    this.appService.allUsers().subscribe((apiResponse) => {
      if(apiResponse.status === 200) {
        let allUsersData = apiResponse.data;
        let name;
        for(let x of allUsersData){
           name = allUsersData.fullName;
        }
        this.fullName.push(name)
        console.log(this.userName)
      console.log(this.firstChar)
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
        console.log(this.allIssues)
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

  public searchIssue: any =() => {
    let data = {
      search : this.search
    }
    this.appService.searchIssue(data).subscribe((apiResponse) => {
      if(apiResponse.status === 200) {
        this.searchData = apiResponse.data
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

  public notifyCount = () =>{
    this.appService.notificationCount(this.userId).subscribe(
      (apiResponse)=>{
        if(apiResponse.status === 200){
          return this.notify = true
        }
      }
    )
  }


  public getNotification = () => {
    this.appService.getAllNotifications().subscribe((apiResponse) => {
      var data = apiResponse.data
      this.notifications.push(data)
      console.log(this.notifications)
      for(var x of this.notifications){
        if(x !== null) {
          for(let y of x) {
            if(y.notificationCount === 1){
              this.count.push(y.notificationCount)
              for(let z of y.notificationDescription) {
                let id = y.issueId

                let data = {
                  issueId : id,
                  descriptions : z
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
}

/**export interface issueApi {
  items : IssueDetails[],
}

export class Issues {
  constructor (private http : HttpClient) {}
  
  getIssues(sort : string, order: string, page: number) : Observable<issueApi> {
    const url = 'http://localhost:3000/api/v1/issue/allIssues'
    const requestUrl = `${url}?q=repo:angular/components&sort=${sort}&order=${order}&page=${page + 1}`
    return this.http.get<issueApi>(`${requestUrl}`);
    console.log("Issues class is called");
  }
}**/