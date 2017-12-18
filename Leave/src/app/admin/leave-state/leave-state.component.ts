import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Input } from '@angular/core';
import { Router } from '@angular/router';

import { AdminService } from '../../service/admin.service';
import { LeaveDetail } from '../../domain/leave-detail';
import { HolidayInfo } from '../../domain/holiday-info';

@Component({
  selector: 'app-leave-state',
  templateUrl: './leave-state.component.html',
  styleUrls: ['./leave-state.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [AdminService]
})
export class LeaveStateComponent implements OnInit {
  @Input() leave: LeaveDetail;
  @Input() options: HolidayInfo[];

  constructor(
    private adminService: AdminService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onSubmit() {
    console.log(this.leave.holiday_apply_state);
    this.router.navigate(['/admin/leave']);
    location.reload();
  }
}
