import { Injectable, Inject } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { Auth } from '../domain/auth';
import { AdminService } from './admin.service';

@Injectable()
export class AuthService {

  constructor(
    private http: Http, 
    private adminService: AdminService,
    @Inject('user') private userService
  ) { }

  loginWithCredentials(username: string, password: string): Promise<Auth> {
    if(username == "admin"){
      return this.adminService.login(username, password)
      .then(res => {
        let auth = new Auth();
        if (res) {
          auth.hasError = false;
          auth.user = username;
        }  else {
          auth.hasError = true;
        }
        return auth;
      })
      .catch(this.handleError);
    }
    else {
      return this.userService.login(username, password)
      .then(res => {
        let auth = new Auth();
        if (res) {
          auth.hasError = false;
          auth.user = username;
        }  else {
          auth.hasError = true;
        }
        return auth;
      })
      .catch(this.handleError);
    }
    
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
