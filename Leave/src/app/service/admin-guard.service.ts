import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AdminGuardService implements CanActivate {

  constructor(
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;
    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    //have login
    if((sessionStorage.getItem('token') != null) && (sessionStorage.getItem('user') == "admin")) {
      return true;
    }
    //not login
    else {
      //store temp url 
      // sessionStorage.setItem('redirectUrl', url);
      //got to login page
      this.router.navigate(['/login']);
      // location.reload();
      return false;
    }
  }
}

