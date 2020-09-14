import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { Router } from '@angular/router';
import { ToastrManager} from 'ng6-toastr-notifications';
import * as countryNames from '../../../assets/countryNames.json';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public firstName : String;
  public lastName : String;
  public userEmail : String;
  public userPassword : any;
  public country : String;
  public mobileNumber : Number;
  public countries : any[] = [];
  public sortedCountry : any[] = [];


  constructor(public appService : AppService, public router : Router, public toastr : ToastrManager) { }


  ngOnInit(): void {
    this.getCountries();
    
  }

  public goToSignin() {
    this.router.navigate(['/signin'])
  }

  public goToResetPassword() {
    this.router.navigate(['/recoverymail'])
  }

  public getCountries: any = () => {
    let data = countryNames
    let x
    for (x in data) {
      //let singleCountry = data[x]
      let singleCountry = {
        name: data[x],
        code: x
      }
      this.countries.sort().push(singleCountry)
      console.log(data)
      console.log(singleCountry.code)
      console.log(this.countries)
      //this.sortedCountry = this.countries.sort()
    }
    //this.countries.sort()
  }

  public signup: any = () => {
    if(!this.firstName) {
      this.toastr.warningToastr('firstName is required')
    } else if(!this.userEmail) {
      this.toastr.warningToastr('userEmail is required')
    } else if(!this.userPassword) {
      this.toastr.warningToastr('userPassword is required')
    } /**else if(!this.country) {
      this.toastr.warningToastr('country is required')
    } **/else if(!this.mobileNumber) {
      this.toastr.warningToastr('mobileNumber is required')
    }

    else {
      let data = {
        firstName : this.firstName,
        lastName : this.lastName,
        userEmail : this.userEmail,
        userPassword : this.userPassword,
        //country : this.country,
        mobileNumber : this.mobileNumber
      }
      this.appService.signUp(data).subscribe((apiResponse) => {
        if(apiResponse.status === 200) {
          Cookie.set('authToken', apiResponse.data.authToken)
          Cookie.set('receiverId', apiResponse.data.userDetails.userId)
          Cookie.set('receiverName', apiResponse.data.userDetails.fullName)
          this.appService.setUserInfoInLocalStorage(apiResponse.data.userDetails)

          this.toastr.successToastr('Signup successfull')
          
          setTimeout(() => {
            this.router.navigate(['/userdashboard'])
          }, 2000)
        } else {
          this.toastr.warningToastr(apiResponse.message)
        }
      },
      (err) => {
        this.toastr.warningToastr('Signup failed, please tryagain later')
      })
    }
  }

}
