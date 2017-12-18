import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Input } from '@angular/core';

import { User } from '../../domain/user';

import { AdminService } from '../../service/admin.service';
import { error } from 'selenium-webdriver';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [AdminService]
})
export class UserComponent implements OnInit {

  @Input() worker: User;

  constructor(
    private adminService: AdminService
  ) { }

  ngOnInit() {
  }

  saveWorker() {
    this.adminService.updateWorker(this.worker)
      .then(res => {
        noty({"text":"Modify information successfully","layout":"top","type":"information"});
      })
      .catch(error => {
        noty({"text":"Someting error","layout":"top","type":"error"});
      })
  }
}
