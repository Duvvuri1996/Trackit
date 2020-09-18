import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from '../../app.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Location } from '@angular/common';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SaveAs } from 'file-saver';
import { subscribeOn } from 'rxjs/operators';

@Component({
  selector: 'app-issue-view',
  templateUrl: './issue-view.component.html',
  styleUrls: ['./issue-view.component.css'],
  providers : [Location]
})
export class IssueViewComponent implements OnInit {

  public watchData : any = [];
  public issueId : String;
  public issueData : any;
  public attachmentList = [];
  public fileId = [];
  public fileName = [];
  public allComments : any;
  public comment : String;
  public count : Number;
  public userId :  any;
  public userName : any;
  public toggler : boolean = false;
  
  constructor( private route : ActivatedRoute, private location : Location, public router : Router, public appService : AppService, public toastr : ToastrManager) { }

  ngOnInit(): void {
    
    this.issueId = this.route.snapshot.paramMap.get('issueId');

    this.userId = Cookie.get('receiverId');

    this.userName = Cookie.get('receiverName');

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
          console.log(this.issueData)
        } 
      } else {
      }
      console.log(this.issueId+" from view")
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
                this.fileName.push(y.filename)
                console.log('fileName '+this.fileName)
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
        console.log('Comments '+ this.allComments)
      }
    })
  }

  public goBack() : any {
    this.location.back()
  }

  public goEditView(){
    this.router.navigate(['/view', this.issueId ])
  }

  public downloadFile = (index) => {
    let fileId = this.fileName[index]
    this.appService.downloadFile(fileId).subscribe((apiResponse) => {
      SaveAs(apiResponse, apiResponse.fileName)
    })
  }

  public deleteIssue = () => {
    this.appService.deleteIssue(this.issueId).subscribe((apiResponse) => {
      if(apiResponse.status === 200){
        this.appService.removeAllWatcher(this.issueId).subscribe((apiResponse) => {
          this.toastr.successToastr('Deleted Successfully')
        setTimeout(()=>{
          this.router.navigate(['/userdashboard']);
        },1000)
        })
      }
    })
  }

  public watch = () => {
    this.appService.postWatch(this.issueId).subscribe((apiResponse) => {
      if(apiResponse.status === 200){
        this.toastr.successToastr("Succussfully added to Watch list...You will be further notified of changes in issue")
        this.toggler = true
      }
      else if(apiResponse.status === 404){
        this.toastr.infoToastr("You are already under watch list")
      }
    }, (err) => {
      this.toastr.errorToastr("Some unkown error occured")
    })
  }

  public addComment = () => {
    if(this.comment){
      let data = {
        issueId : this.issueId,
        comment : this.comment,
        reporterName : this.userName,
        reporterId : this.userId
      }
      this.appService.createComment(data).subscribe((apiResponse) => {
        this.toastr.successToastr('Comment created successfully')
        this.getAllComments()
        this.comment = ''
      })
    } else {
      this.toastr.warningToastr('Enter comment...')
    }
  }

  public deleteComment = (commentId) => {
    this.appService.deleteComment(commentId).subscribe((apiResponse) => {
      this.toastr.successToastr(apiResponse.message)
      this.getAllComments()
    })
  }

  public watchCount = () => {
    this.appService.watchCount(this.issueId).subscribe((apiResponse) => {
      if(apiResponse.status === 200) {
        this.count = apiResponse.data.count
      } else {
        this.toastr.infoToastr('No watch list for this issue')
        console.log(this.count+' count is this')
      }
    })
  }

  public deleteWatcher = () => {
    let data = {
      watchId : this.userId,
      issueId : this.issueId
    }
    this.appService.deleteWatch(data).subscribe((apiResponse) => {
      if(apiResponse.status === 200){
        this.toastr.successToastr("Your watch ended!")
        setTimeout(() => {
          this.router.navigate(['/userdashboard'])
        }, 1000)
      } else {
        this.toastr.errorToastr("Unable to Unwatch...please try again")
      }
    })
  }
}
