import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { AdminService } from '../../service/admin.service';
import { User } from '../../domain/user';

@Component({
  selector: 'app-useradd',
  templateUrl: './useradd.component.html',
  styleUrls: ['./useradd.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [AdminService]
})
export class UseraddComponent implements OnInit {

  worker: User = {
    worker_address: '',
    worker_degree: [],
    worker_email: '', 
    worker_id: '',
    worker_male: true, 
    worker_name: '', 
    worker_workAdd_time: 0,
    worker_year_holidays_residue: 0, 
    worker_year_holidays_used: 0
  }
  password1: string;
  password2: string;

  constructor(
    private adminService: AdminService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onSubmit() {
    // console.log(this.worker);
    // console.log(this.password1, this.password2);
    if(!this.worker.worker_id || !this.worker.worker_name || !this.worker.worker_email 
        || !this.worker.worker_address || !this.password1 || !this.password2) {
          noty({"text":"Please fill all information","layout":"top","type":"error"});
          return;
        }
    if(this.password1 != this.password2) {
      noty({"text":"Password should be the same.","layout":"top","type":"error"});
      return;
    }

    let newUser = {
      'worker_id': this.worker.worker_id,
      'worker_name': this.worker.worker_name,
      'worker_email': this.worker.worker_email,
      'worker_address': this.worker.worker_address,
      'password': this.password1,
      'password2': this.password2
    };

    this.adminService.createWorker(newUser)
      .then(res => {
        noty({"text":"Add new worker successfully!","layout":"top","type":"information"});
        this.router.navigate(['/admin']);
        location.reload();
      })
      .catch(error => {
        noty({"text": "Something error", "layout":"top","type":"error"});
      })

  }
}
