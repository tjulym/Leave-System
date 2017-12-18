import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { User } from '../../domain/user';
import { UserService } from '../../service/user.service';
import { CommonService } from '../../service/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-modify',
  templateUrl: './profile-modify.component.html',
  styleUrls: ['./profile-modify.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [UserService, CommonService]
})
export class ProfileModifyComponent implements OnInit {

  user: User;
  sex: string = "男";
  degree: string = '';
  department: string = '';
  show: false;

  constructor(
    private userService: UserService,
    private comonService: CommonService,
    private router: Router
  ) { }

  ngOnInit() {
    this.userService.getUser()
    .then(user => {
      this.user = user;
      // console.log(this.user);
      if(!this.user.worker_male){
        this.sex = "女";
      }
      this.comonService.getDegree(this.user.worker_degree[0].degree_degree_id)
        .then(degree => this.degree = degree);
      this.comonService.getDepartment(this.user.worker_degree[0].degree_department_id)
        .then(department => this.department = department);
    });
  }

  modify_worker() {
    if(!this.user.worker_email || !this.user.worker_address){
      noty({"text":"Please fill all infomation!","layout":"top","type":"error"});
      return;
    }
    else {
      this.userService.updateUser(this.user)
        .then(() => {
          this.router.navigate(["/"]);
          location.reload();
        });
    }
  }
}
