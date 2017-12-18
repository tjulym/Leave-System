import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Input } from '@angular/core';
import { Router } from '@angular/router';

import { AdminService } from '../../service/admin.service';
import { DepartmentInfo } from '../../domain/department-info';
import { User } from '../../domain/user';

@Component({
  selector: 'app-permit',
  templateUrl: './permit.component.html',
  styleUrls: ['./permit.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [AdminService]
})
export class PermitComponent implements OnInit {
  @Input() department: DepartmentInfo[];
  @Input() worker: User;
  @Input() department_degrees: Object;
  
  department_id: number = 1;
  degree_id: number = 0;
  

  constructor(
    private adminService: AdminService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  // onChange(department_id: number) {
  //   console.log(department_id);
  //   this.worker.worker_degree.forEach(element => {
  //     if(element && element.degree_department_id == department_id) {
  //       this.degree_id = element.degree_degree_id;
  //     }
  //   });
  //   // this.degree_id
  
  // }


  onSubmit() {
    this.adminService.updateDegree(this.worker.worker_id, this.department_id, 
        this.department_degrees[this.department_id])
        .then(res => {
          noty({"text": res['message'], "layout":"top","type":(res['error']? "error": "information")});
          this.router.navigate(['/admin']);
          location.reload();
        })
        .catch(error => {
          noty({"text": error['message'], "layout":"top","type":"error"});
        });
  }

}
