import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { CommonService } from '../service/common.service';
import { AdminService } from '../service/admin.service';
import { DegreeInfo } from '../domain/degree-info';
import { DepartmentInfo } from '../domain/department-info';
import { User } from '../domain/user';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [CommonService, AdminService]
})
export class AdminComponent implements OnInit {
  columns = [ '工号', '姓名', '性别', '部门', 
  '职务', '邮箱', '地址', '操作'];
  degrees: DegreeInfo[];
  departments: DepartmentInfo[];
  dataList: User[];
  page: number = 1;
  per_page: number = 10;
  total_page_num: number;
  selectedWorker: User = {
    worker_address: 'tju',
    worker_degree: [],
    worker_email: '', 
    worker_id: '',
    worker_male: true, 
    worker_name: '', 
    worker_workAdd_time: 1,
    worker_year_holidays_residue: 1, 
    worker_year_holidays_used: 1
  }

  department_degrees: Object = {};

  constructor(
    private commomService: CommonService,
    private adminService: AdminService
  ) { }

  ngOnInit() {
    this.adminService.getDegreeInfo()
      .then(infos => {
        this.degrees = infos;
        this.adminService.getDepartmentInfo()
          .then(info2 => {
            this.departments = info2;
            this.init();
          })
      })
  }

  init() {
    this.adminService.getWorkers(this.page, this.per_page)
      .then(users => {
        this.dataList = users['workers'];
        // console.log(this.dataList)
        this.total_page_num = users['total_page_num'];
      })
  }

  freshList(event) {
    this.page = event.currentPage;
    this.per_page = event.itemsPerPage;
    this.init();
  }

  loadWorker(worker: User) {
    this.selectedWorker = worker;
    $("#worker_modal").modal("show");
  }

  passwd(worker: User) {
    this.selectedWorker = worker;
    $("#password_modal").modal("show");
  }

  permission(worker: User) {
    this.selectedWorker = worker;
    this.department_degrees = {};
    this.selectedWorker.worker_degree.forEach(element => {
      if(element) {
        let k = element.degree_department_id;
        let v = element.degree_degree_id;
        this.department_degrees = Object.assign({}, this.department_degrees, {[k]: v})
      }
    });
    // console.log(this.department_degrees);
    $("#degree_modal").modal("show");
  }
}
