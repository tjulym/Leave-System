import { Component, OnInit, Inject } from '@angular/core';

import { Router, ActivatedRoute, Params } from '@angular/router';

import { Auth } from '../domain/auth';

declare var $:any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  tip_show = false;
  tip_class = '';
  tip_message1 = '';
  tip_message2 = '';
  auth: Auth;

  constructor(@Inject('auth') private service, private router: Router) { }

  ngOnInit() {
  }

  onSubmit(formValue) {
    if(formValue.login.username.length > 0 && formValue.login.password.length > 0){
      this.service
      .loginWithCredentials(formValue.login.username, formValue.login.password)
      .then(auth => {
        if(!auth.hasError){
          this.tip_class = 'alert-success',
          this.tip_message1 = 'Success!',
          this.tip_message2 = 'You successfully login.',
          this.tip_show = true;
          sessionStorage.setItem("user", formValue.login.username);
          if(sessionStorage.getItem('redirectUrl') != null){
            this.router.navigate([sessionStorage.getItem('redirectUrl')]);
            sessionStorage.removeItem('redirectUrl');
          } else {
            if(formValue.login.username == "admin")
              this.router.navigate(['/admin'])
            else
              this.router.navigate(['/profile'])
          }
          
          location.reload();
        } else {
          this.tip_class = 'alert-danger',
          this.tip_message1 = 'Error!',
          this.tip_message2 = 'Wrong username or password.',
          this.tip_show = true;
        }
      })
    } else {
      this.tip_class = 'alert-danger',
      this.tip_message1 = 'Error!',
      this.tip_message2 = 'Please fill all information.',
      this.tip_show = true;
    }
  }
}
