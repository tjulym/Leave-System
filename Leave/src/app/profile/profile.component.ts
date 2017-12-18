import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';

import { User } from '../domain/user';
import { UserService } from '../service/user.service';
import { CommonService } from '../service/common.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [UserService, CommonService]
})
export class ProfileComponent implements OnInit {

  user: User = new User();
  sex: string = "男";
  degree: string = '';
  department: string = '';

  constructor(
    private userService: UserService,
    private comonService: CommonService
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

}
