import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router, ActivatedRoute } from '@angular/router';
import { FileUploader, FileSelectDirective } from 'ng2-file-upload';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-issue-create',
  templateUrl: './issue-create.component.html',
  styleUrls: ['./issue-create.component.css']
})
export class IssueCreateComponent implements OnInit {

  private uri = '/api/v1/issue/uploads';
  public uploader : FileUploader = new FileUploader({url : this.uri})
  public attachmentList : any = [];

  constructor(public router : Router, public appService : AppService, public toastr : ToastrManager, public route : ActivatedRoute) { 
    this.getAllUsers();
      this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any)=> {
      this.attachmentList.push(JSON.parse(response))
      console.log(this.attachmentList)
    }
  }

  public issueTitle : String;
  public issueDescription : String;
  public assigneeId : String;
  public assigneeName : String;
  public userName : String;
  public userId :  String;
  public allUsers = [];
  public images  = [];
  public fileId = [];
  public status : any;
  public selectedUser : any;
  public allStatus = ["Backlog", "In-Progress", "In-Test", "Done"];
  

  ngOnInit(): void {
    this.userName = Cookie.get('receiverName');
    this.userId = Cookie.get('receiverId');
    
  }

  public getAllUsers = () => {
    let users = []
    this.appService.allUsers().subscribe((apiResponse) => {
      for(let x of apiResponse.data){
        users.push(x)
      }
    })
    this.appService.socialUsers().subscribe((apiResponse) => {
      for(let x of apiResponse.data) {
        users.push(x)
      }
    })
    this.allUsers = users
  }
  public onSelectingUser = (user) => {
    this.selectedUser = user
  }

  public createIssue = () => {

    for (let y of this.allUsers) {
      if (y.userId === this.assigneeId) {
        var x = y.firstName + " " + y.lastName
      }
    }

    for(let y of this.attachmentList) {
      this.fileId.push(y.file.id)
      console.log(y.file.id)
      console.log(this.fileId)
    }

    this.assigneeName = x
    if (!this.issueTitle) {
      this.toastr.warningToastr('Enter Title')
    }
    else if (!this.issueDescription) {
      this.toastr.warningToastr('enter Description')
    }
    else if (!this.assigneeName) {
      this.toastr.warningToastr('Select assigneeName')
    }
    else if (!this.userName) {
      this.toastr.warningToastr('Select assigneeName')
    }
    else if (!this.status) {
      this.toastr.warningToastr('Status should not be empty')
    } else {
      let data = {
        issueTitle : this.issueTitle,
        issueDescription : this.issueDescription,
        assigneeName : this.assigneeName,
        assigneeId : this.assigneeId, //this.selectedUser
        status : this.status,
        images : this.fileId,
        userName : this.userName,
        userId : this.userId
      }

      this.appService.createIssue(data).subscribe((apiResponse) => {
        console.log('create issue')
        if(apiResponse.status === 200){
          this.toastr.successToastr('Issue created successfully')
          console.log(apiResponse.data.images)
          console.log(apiResponse.data)
          setTimeout(() => {
            this.router.navigate(['/userdashboard'])
          }, 2000)
          console.log('create issue')
        } else {
          this.toastr.warningToastr('Failed to create new issue')
        }
      }, (err) => {
        this.toastr.errorToastr('Some error occured...please try again later')
        setTimeout(() => {
          this.router.navigate(['/servererror'])
        }, 1000)
      })
    }
  }
}
