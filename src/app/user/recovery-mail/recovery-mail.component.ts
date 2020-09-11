import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-recovery-mail',
  templateUrl: './recovery-mail.component.html',
  styleUrls: ['./recovery-mail.component.css']
})
export class RecoveryMailComponent implements OnInit {

  public userEmail : any;

  constructor(public toastr : ToastrManager, public appService : AppService, public router : Router) { }

  ngOnInit(): void {
  }
  
  public goToSignIn() {
    this.router.navigate(['/signin'])
  }

  public goToSignUp() {
    this.router.navigate(['/signup'])
  }

  public recoveryMail : any = () => {
    if(!this.userEmail) {
      this.toastr.warningToastr('userEmail is required')
    } else {
      let data = {
        userEmail : this.userEmail
      }
      this.appService.recoveryMail(data).subscribe((apiResponse) => {
        if(apiResponse.status === 200) {
          this.toastr.successToastr('Recovery token sent to your email Id')
          this.router.navigate(['/signin'])
        } else {
          this.toastr.warningToastr(apiResponse.message)
        }
      },
      (err) => {
        this.toastr.errorToastr('Failed to send recovery token to the mail id')
        this.router.navigate(['/signin'])
      })
    }
  }
}
