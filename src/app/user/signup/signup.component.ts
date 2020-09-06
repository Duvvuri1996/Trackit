import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { Router } from '@angular/router';
import { ToastrManager} from 'ng6-toastr-notifications';
import * as countryNames from '../../../assets/countryNames.json';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public firstName : any;
  public lastName : any;
  public userEmail : any;
  public userPassword : any;
  public country : any;
  public mobileNumber : any;
  public countries : any[] = [];
  public sortedCountry : any[] = [];


  constructor(public appService : AppService, public router : Router, public toastr : ToastrManager) { }


  ngOnInit(): void {
  }
  public getCountries: any = () => {
    let data = countryNames
    for (let x in data) {
      let singleCountry = data[x]
      this.countries.push(singleCountry)
    }
    this.sortedCountry = this.countries.sort()

  }

  public signup: any = () => {
    if(!this.firstName) {
      this.toastr.warningToastr('firstName is required')
    } else if(!this.userEmail) {
      this.toastr.warningToastr('userEmail is required')
    } else if(!this.userPassword) {
      this.toastr.warningToastr('userPassword is required')
    } else if(!this.country) {
      this.toastr.warningToastr('country is required')
    } else if(!this.mobileNumber) {
      this.toastr.warningToastr('mobileNumber is required')
    }

    else {
      let data = {
        firstName : this.firstName,
        lastName : this.lastName,
        userEmail : this.userEmail,
        userPassword : this.userPassword,
        country : this.country,
        mobileNumber : this.mobileNumber
      }
      this.appService.signUp(data).subscribe((apiResponse) => {
        if(apiResponse.status === 200) {
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
