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
import{ Location } from '@angular/common';
import { TableFilterPipe } from '../../table-filter.pipe';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})


export class UserDashboardComponent implements OnInit{
  dataSource : MatTableDataSource<IssueDetails>;
  dataSource1 : MatTableDataSource<IssueDetails>;
  dataSource2 : MatTableDataSource<IssueDetails>;
  tableColumns = ["issueTitle", "status", "userName", "createdOn", "issueId"]
  p: number = 1;
  @ViewChild(MatPaginator) matPaginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;

  public watchAllDetails = [];
  public allIssues: any[]  = [];
  public singleIssue : any;
  public userId : any;
  public userName : any;
  public searchData : any[] = [];
  public fullName  = [];
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
  public issuesAssignee = [];

  constructor( public location : Location, public router : Router, public appService : AppService, public toastr : ToastrManager, public http: HttpClient) { }

  ngOnInit(): void {
  
    this.authToken = Cookie.get('authToken');
    this.userName = Cookie.get('receiverName');
    this.userId = Cookie.get('receiverId');
    this.getAllUsers();
    this.socialUsers();
    this.getNotification();
    this.getAllIssues();
    this.appService.getAllIssues().subscribe((apiResponse) => {
      let allData = []
        allData = apiResponse.data
        
        for(var x of allData){
          
          if(x.assigneeId === this.userId){
            this.issuesAssignee.push(x)
          }
      this.dataSource = new MatTableDataSource(this.issuesAssignee);
      this.dataSource.paginator = this.matPaginator;
      this.dataSource.sort = this.matSort; 
        }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
    })
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  applyFilter1(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource1.filter = filterValue;
  }
  applyFilter2(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource2.filter = filterValue;
  }
 public goToCreateDashboard () {
   this.router.navigate(['/create'])
 }

 public goToViewDashboard (issueId) {
   this.router.navigate(['/issueView/', issueId])
   
 }
  

  public getAllUsers: any = () => {
    this.appService.allUsers().subscribe((apiResponse) => {
      if(apiResponse.status === 200) {
        let allUsersData = apiResponse.data;
        let name;
        for(let x of allUsersData){
           name = x.fullName;
        }
        this.fullName.push(name)
      }
    })
  }// end getAllUsers

  public socialUsers:  any = () => {
    this.appService.socialUsers().subscribe((apiResponse) => {
      if(apiResponse.status === 200) {
        let allUsersData = apiResponse.data;
        let name;
        for(let x of allUsersData){
           name = `${x.firstName} ${x.lastName}`
        }
        this.fullName.push(name)
        
      }
    })
  }// end socialUsers

  public getAllIssues: any =() => {
    this.appService.getAllIssues().subscribe((apiResponse) => {
      if(apiResponse.status === 200) {
        let allData = []
        allData = apiResponse.data
        
        for(var x of allData){
          
          if(x.assigneeId === this.userId){
            this.allIssues.push(x)
          }
         }
        }
      },(error) => {
        this.toastr.warningToastr('No issues to view')
    })
    
  }//end getAllIssues
    

  public searchIssue: any =() => {
    let data = {
      search : this.search
    }
    this.watchToggle = false
    this.appService.searchIssue(data).subscribe((apiResponse) => {
      if(apiResponse.status === 200) {
        this.search = ''
        this.searchData = apiResponse.data
        this.dataSource1 = new MatTableDataSource(this.searchData);
        this.dataSource1.paginator = this.matPaginator;
        this.dataSource1.sort = this.matSort;
        return this.toggler = false
      } else {
        this.toastr.infoToastr('No result found')
        this.goBack()
      }
    })
  }// end searchIssue

  public goToIssuesCreate (): any {
    this.router.navigate(['/create'])
  } //end

  public logout = () => {
    let token = this.authToken
    
    if(this.authToken !== undefined || this.authToken !== '' || this.authToken !== null){
      this.appService.logout().subscribe((apiResponse) => {
          Cookie.deleteAll('receiverId')
          Cookie.deleteAll('receiverName')
          Cookie.deleteAll('authToken')
          localStorage.clear()
          this.router.navigate(['/signin'])
        })
    } else {
      this.appService.logoutSoicalUser().subscribe(() => {
        
        Cookie.delete('receiverId', '/')
        Cookie.delete('receiverName', '/')
        localStorage.clear()
        this.router.navigate(['/signin'])
        
      }) 
    }
  } //end logout

  public getWatchList = () => {
    this.watchToggle = true;
    this.toggler = false;
    this.appService.watchOfUser(this.userId).subscribe((apiResponse) => {
      if(apiResponse.status === 200) {
        let details = apiResponse.data;
        console.log(apiResponse.data)
        for(let x of apiResponse.data){
          if(x.watchId === this.userId){
              if(this.allIssues !== null){
                for(let y of this.allIssues){
                  if(x.issueId === y.issueId){
                    this.watchDetails.push(y)
                  }
                }
            this.watchAllDetails = this.watchDetails
             this.dataSource2 = new MatTableDataSource(this.watchAllDetails);
             this.dataSource2.paginator = this.matPaginator;
             this.dataSource2.sort = this.matSort;
             console.log(this.dataSource2) 
          }
        } 
       }
              
      } 
      else {
        this.toastr.warningToastr('No watch list')
        this.goBack()
      }
    })
  } //end getWatchList
  public goBack =() => {
    this.router.navigate(['/userdashboard'])
  }

  public back = () => {
    
    return ((this.toggler = true) && (this.watchToggle = false))
  }

  public getNotification = () => {
    this.appService.getAllNotifications().subscribe((apiResponse) => {
      this.notifications.push(apiResponse.data)
      for(var x of this.notifications){
        if(x !== null){
          for(let b of x){
            if(b.userId === this.userId) {
                if(b.notificationCount === 1){
                  this.count.push(b.notificationCount)
                  for(let z of b.notificationDescription) {
                    let id = b.issueId
                    let des = z
                    let data = {
                      issueId : id,
                      description : des
                    }
                    this.notifyData.push(data)
                  }
                } 
              }
          }
        }
         else {
          if(this.count.length === 0) {
            return this.notify = true
          }
        }
      }
    })
  } //end getNotificationCount

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