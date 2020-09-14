import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AppService } from './app.service';
import{ ToastrManager } from 'ng6-toastr-notifications';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(public router: Router, public appService : AppService, public toastr : ToastrManager) { }

  canActivate(route: ActivatedRouteSnapshot) :  boolean {
    
    if(this.appService.getUserInfoInLocalStorage() !== null || this.appService.getUserInfoInLocalStorage() !== undefined || this.appService.getUserInfoInLocalStorage() !== '') {
      
      return true;
    
    } else {
      
      this.router.navigate(['/signin'])
      
      this.toastr.errorToastr('Please Login again')
      
      return false;
    
    }
  }

}
