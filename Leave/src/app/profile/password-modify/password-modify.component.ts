import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-modify',
  templateUrl: './password-modify.component.html',
  styleUrls: ['./password-modify.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [UserService]
})
export class PasswordModifyComponent implements OnInit {

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
  }

  onSubmit(formValue) {
    if(!formValue.password.oldPassword || !formValue.password.newPassword1 || !formValue.password.newPassword2){
      noty({"text":"Please fill all information","layout":"top","type":"error"});
      return;
    }
    else if(formValue.password.newPassword1 != formValue.password.newPassword2){
      noty({"text":"Please input same new password!","layout":"top","type":"error"});
      return;
    }
    else if(formValue.password.oldPassword == formValue.password.newPassword1){
      noty({"text":"New password can't be same with old!","layout":"top","type":"error"});
      return;
    }
    this.userService.updatePassword(formValue.password.newPassword1)
      .then(() => {
        noty({"text":"Modify password successfully","layout":"top","type":"information"});
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("token");
        this.router.navigate(['/login']);
        location.reload();
      })
  }
}
