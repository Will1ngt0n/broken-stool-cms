import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth-services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReverseAuthGuardGuard implements CanActivate {
  constructor(private authService : AuthService, private router : Router){ }
  canActivate() : Promise<boolean> {
    return this.authService.checkingAuthStateBoolean().then( (bln : boolean) => {
      if(bln === true) {
        this.router.navigate(['/landing'])
        return false
      } else {
        return true
      }
    
    })
    // if(this.authService.checkingAuthStateBoolean()){
    //   console.log(false);  
    //   this.router.navigate(['landing'])
    //   return false
    // }else{
    //   console.log(true);
    //   return true
    // }
  }
}
