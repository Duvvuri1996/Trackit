import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SaveAs } from 'file-saver';
import { FileSelectDirective, FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-issue-edit',
  templateUrl: './issue-edit.component.html',
  styleUrls: ['./issue-edit.component.css']
})
export class IssueEditComponent implements OnInit {

  private uri = 'http://localhost:3000/api/v1/issue/uploads';
  uploader : FileUploader = new FileUploader({url : this.uri})
  public attachmentList : any = [];
  public singleAttachment : any = [];

  constructor(public location : Location, public router : Router, public appService : AppService, public toastr : ToastrManager, public route : ActivatedRoute) { 
    this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any)=> {
      this.singleAttachment.push(JSON.parse(response))
      console.log(this.singleAttachment)
    }
  }
  
  public issueTitle : String;
  public issueDescription : String;
  public assigneeId : String;
  public assigneeName : String;
  public userName : String;
  public userId :  String;
  public issue : any;
  public issueId : any;
  public allUsers = [];
  public images  = [];
  public fileId = [];
  public fileName = [];
  public status : any;
  public selectedUser : any;
  public allStatus = ["Backlog", "In-Progress", "In-Test", "Done"];

  ngOnInit(): void {
    this.issueId = this.route.snapshot.paramMap.get('issueId')
    this.userName = Cookie.get('receiverName');
    this.userId = Cookie.get('receiverId');
    this.getAllUsers();
    this.getSingleIssue(this.issueId);
    this.getAttachments();
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

  public downloadFile = (index) => {
    let fileName = this.fileName[index]
    this.appService.downloadFile(fileName).subscribe((apiResponse) => {
      SaveAs(apiResponse, apiResponse.fileName)
    })
  }

  public getSingleIssue = (issueId) => {
    this.appService.singleIssue(issueId).subscribe((apiResponse) => {
      if(apiResponse.status === 200) {
        this.issue = apiResponse.data
        this.issueTitle = apiResponse.data.issueTitle
        this.issueDescription = apiResponse.data.issueDescription
        this.assigneeName = apiResponse.data.assigneeName //this.selectedUser
        this.assigneeId = apiResponse.data.assigneeId
        this.status = apiResponse.data.status
        this.images = apiResponse.data.images
        this.userName = apiResponse.data.userName
        this.userId = apiResponse.data.userId
        for(let img of this.images){
          this.fileId.push(img)
        }
        this.toastr.successToastr('Issue details found')
      } else {
        this.toastr.errorToastr('Error while finding details')
      }
    })
  }
  public getAttachments = () => {
    this.appService.getAllFiles().subscribe((apiResponse) => {
        this.attachmentList.push(apiResponse.data)
        for(let x of this.attachmentList){
          for(let y of x){
            for(let a of this.fileId){
              if(a === y._id){
                this.fileName.push(y.fileName)
              }
            }
          }
        }
    })
  }

  public editIssue: any = () => {

    for(let y of this.singleAttachment) {
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
    else if (!this.status) {
      this.toastr.warningToastr('Status should not be empty')
    }

    let data = {
      issueTitle : this.issueTitle,
      issueDescription : this.issueDescription,
      assigneeName : this.selectedUser.userName,
      assigneeId : this.selectedUser.userId, //this.selectedUser
      status : this.status,
      images : this.images
    }
    this.appService.editIssue(data).subscribe((apiResponse) => {
      if(apiResponse.status === 200) { 
        this.toastr.successToastr('Issues updated successfully')
        setTimeout(() => {
          this.router.navigate([`/view/]${this.issueId}`])
        }, 2000)
      } else {
        this.toastr.warningToastr('Please update again...')
      }
    },
    (error) => {
      this.toastr.errorToastr("Some error occured", "Error")
      this.router.navigate(['/servererror'])
    })
  }
}
