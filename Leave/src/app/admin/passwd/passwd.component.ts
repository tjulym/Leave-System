import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Input } from '@angular/core';

import { AdminService } from '../../service/admin.service';

@Component({
  selector: 'app-passwd',
  templateUrl: './passwd.component.html',
  styleUrls: ['./passwd.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PasswdComponent implements OnInit {

  @Input() worker_id: number;
  password1: string;
  password2: string;

  constructor(
    private adminService: AdminService
  ) { }

  ngOnInit() {
  }

  onSubmit() {
    // console.log(this.worker_id);
    // console.log(this.password1, this.password2)
    if(!this.password1 || !this.password2) {
      noty({"text":"Please fill all information","layout":"top","type":"error"});
      return;
    }
    if(this.password1 != this.password2) {
      noty({"text":"Please input same new password!","layout":"top","type":"error"});
      return;
    }

    this.adminService.passwd(this.worker_id, this.password1, this.password2)
      .then(res => {
        noty({"text":"Modify password successfully","layout":"top","type":"information"}); 
      })
      .catch(error => {
        noty({"text":'Someting error', "layout":"center","type":"error"});
      })
  }

}
