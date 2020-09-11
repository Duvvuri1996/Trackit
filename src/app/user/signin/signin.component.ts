import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  public userEmail : any;
  public userPassword : any;

  constructor(public appService : AppService, public router : Router, public toastr : ToastrManager) { }

  ngOnInit(): void {
  }
  public goToSignUp() {
    this.router.navigate(['/signup'])
  }

  public goToResetPassword() {
    this.router.navigate(['/recoverymail'])
  }

  public signin : any = () => {

    if(!this.userEmail){
      this.toastr.warningToastr('userEmail is required')
    } else if(!this.userPassword) {
      this.toastr.warningToastr('userPassword is required')
    } else {
      let data = {
        userEmail : this.userEmail,
        userPassword : this.userPassword
      }
      this.appService.signin(data).subscribe((apiResponse) => {
        if(apiResponse.status === 200) {
          Cookie.set('authToken', apiResponse.data.authToken)
          Cookie.set('receiverId', apiResponse.data.userDetails.userId)
          Cookie.set('receiverName', apiResponse.data.userDetails.userName)
          this.appService.setUserInfoInLocalStorage(apiResponse.data.userDetails)
          this.toastr.successToastr('Login successfull')
          setTimeout(() => {
            this.router.navigate(['/userdashboard'])
          }, 2000)
        } else {
          this.toastr.errorToastr(apiResponse.message)
        }
      },
      (err) => {
        this.toastr.errorToastr('Failed to login')
      })
    }
    
  }

  public socialLogin : any = () => {
    window.open('/auth/google/', "mywindow", "location=1, status=1, scrollbars=1, width=800, height=800")
    let listener = window.addEventListener('message', (message) => {
      this.appService.setUserInfoInLocalStorage(message.data.user)
      Cookie.set('userName', message.data.user.firstName +' '+ message.data.user.lastName)
      Cookie.set('userId', message.data.user.userId)
      this.router.navigate(['/userdashboard'])
    })
  }
}
