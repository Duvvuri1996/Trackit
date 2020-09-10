import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SaveAs } from 'file-saver';

@Component({
  selector: 'app-issue-view',
  templateUrl: './issue-view.component.html',
  styleUrls: ['./issue-view.component.css']
})
export class IssueViewComponent implements OnInit {

  public userId :  any;
  public UserName : any;
  public issueData : any;
  public allComments : any;
  public comment : String;
  public count : Number;
  public issueId : String;
  public watchData : any = [];
  public attachmentList = [];
  public fileId = [];
  public fileName = [];

  constructor(public location : Location, public router : Router, public appService : AppService, public toastr : ToastrManager, public route : ActivatedRoute) { }

  ngOnInit(): void {
    this.issueId = this.route.snapshot.paramMap.get('issueId');
    
    this.singleIssue();
    this.getAttachments();
    this.getAllComments();
    this.watchCount();

  }

  public singleIssue = () => {
    this.appService.singleIssue(this.issueId).subscribe((apiResponse) => {
      if(apiResponse.status === 200) {
        this.issueData = apiResponse.data
        this.watchData.push(this.issueData)
        for(let imageId of this.issueData.images) {
          this.fileId.push(imageId)
        } 
      } else {
        this.toastr.infoToastr('No Issue found')
      }
    })
  }

  public getAttachments = () => {
    this.appService.getAllFiles().subscribe((apiResponse) => {
      if(apiResponse.status === 200) {
        this.attachmentList.push(apiResponse.data)
        for(let x of this.attachmentList){
          for(let y of x) {
            for(let a of this.fileId){
              if( a === y._id){
                this.fileName.push(y.fileName)
              }
            }
          }
        }
      }
    })
  }

  public getAllComments = () => {
    this.appService.getAllComments(this.issueId).subscribe((apiResponse) => {
      if(apiResponse.status === 200) {
        this.allComments = apiResponse.data
      }
    })
  }

  public goBack() : any {
    this.location.back()
  }

  public downloadFile = (index) => {
    let fileName = this.fileName[index]
    this.appService.downloadFile(fileName).subscribe((apiResponse) => {
      SaveAs(apiResponse, apiResponse.fileName)
    })
  }

  public deleteIssue = () => {
    this.appService.deleteIssue(this.issueId).subscribe((apiResponse) => {
      if(apiResponse.status === 200){
        this.toastr.successToastr('Deleted Successfully')
        setTimeout(()=>{
          this.router.navigate(['/userdashboard']);
        },2000)
      }
    })
  }

  public watch = () => {
    this.appService.postWatch(this.issueId).subscribe((apiResponse) => {
      if(apiResponse.status === 200) {
        this.toastr.successToastr('Added to watch list, will be notified if any changes is the issue')
      } else {
        this.toastr.errorToastr('Unable to post watch')
      }
    })
  }

  public addComment = () => {
    let data = {
      issueId : this.issueId,
      comment : this.comment
    }
    this.appService.createComment(data).subscribe((apiResponse) => {
      this.toastr.successToastr('Comment created successfully')
      this.getAllComments()
      this.comment = ''
    })
  }

  public watchCount = () => {
    this.appService.watchCount(this.issueId).subscribe((apiResponse) => {
      if(apiResponse.status === 200) {
        this.count = apiResponse.data.count
      } else {
        this.toastr.infoToastr('No watch list for this issue')
      }
    })
  }
}
