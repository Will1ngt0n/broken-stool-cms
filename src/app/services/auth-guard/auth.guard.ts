import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth-services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService : AuthService, private router : Router){ }
  
  canActivate() : Promise<boolean>{
    //let boolean : boolean
    //this.authService.checkingAuthState()
    return this.authService.checkingAuthStateBoolean().then( (bln : boolean) => {
      if(bln === false) {
        this.router.navigate(['home/FAQs'])
      }
      return bln
    })
  //   if(this.authService.checkingAuthStateBoolean().then( bln => {console.log(bln);
  //   ;return bln})){
  //     console.log(true);
  //     return true
  //   }else{
  //     console.log(false);
  //     this.router.navigate(['home/FAQs'])
  //     return false
  //   }
  }
}
