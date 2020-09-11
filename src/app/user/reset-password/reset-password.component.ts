import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  public userPassword : any;
  public recoveryToken : any; 

  constructor(public router : Router, public route : ActivatedRoute, public toastr : ToastrManager, public appService : AppService) { }

  ngOnInit(): void {
    this.recoveryToken = this.route.snapshot.paramMap.get('recoveryToken')
  }

  public goToSignIn() {
    this.router.navigate(['/signin'])
  }

  public goToSignUp() {
    this.router.navigate(['/signup'])
  }
  
  public resetPassword : any =() => {
    if(!this.userPassword) {
      this.toastr.warningToastr('userPassword is required')
    } else {
      let data = {
        userPassword : this.userPassword,
        recoveryToken : this.recoveryToken
      }
      this.appService.resetPassword(data).subscribe((apiResponse) => {
        if(apiResponse.status === 200) {
          this.toastr.successToastr('Password changed successfully')
          setTimeout(() => {
            this.router.navigate(['/signin'])
          }, 2000)
        } else {
          this.toastr.errorToastr(apiResponse.message)
          
        }
      },
      (err) => {
        this.toastr.errorToastr('Password update failed')
        this.router.navigate(['/servererror'])
      })
    }
  }
}
