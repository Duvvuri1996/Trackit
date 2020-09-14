import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router, ActivatedRoute } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-issue-create',
  templateUrl: './issue-create.component.html',
  styleUrls: ['./issue-create.component.css']
})
export class IssueCreateComponent implements OnInit {

  private uri = 'http://localhost:3000/api/v1/issue/uploads';
  uploader : FileUploader = new FileUploader({url : this.uri})
  public attachmentList : any = [];

  constructor(public location : Location, public router : Router, public appService : AppService, public toastr : ToastrManager, public route : ActivatedRoute) { 
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
    this.getAllUsers();
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
    for(let y of this.attachmentList) {
      this.fileId.push(y.file.id)
    }
    if (!this.issueTitle) {
      this.toastr.warningToastr('enter issueTitle')
    }
    else if (!this.issueDescription) {
      this.toastr.warningToastr('enter issueDescription')
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
        assigneeName : this.selectedUser.fullName,
        assigneeId : this.selectedUser.userId, //this.selectedUser
        status : this.status,
        images : this.images,
        userName : this.userName,
        userId : this.userId
      }
      this.appService.createIssue(data).subscribe((apiResponse) => {
        if(apiResponse.status === 200){
          this.toastr.successToastr('Issue created successfully')
          setTimeout(() => {
            this.router.navigate(['/userdashboard'])
          })
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
