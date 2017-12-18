import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Input } from '@angular/core';

import { UserService } from '../../service/user.service';
import { LeaveDetail } from '../../domain/leave-detail';
import { HolidayInfo } from '../../domain/holiday-info';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [UserService]
})
export class DetailComponent implements OnInit {

  @Input() leave: LeaveDetail;
  @Input() options: HolidayInfo[];
  @Input() ban: boolean;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
  }

  onSubmit(formValue) {
    let start = $("#holiday_time_begin").val();
    let end = $("#holiday_time_end").val();
    console.log(formValue.modify.holiday_type)
    console.log(formValue.modify.holiday_reason)
    console.log(start)
    console.log(end)
    if(!formValue.modify.holiday_type || !formValue.modify.holiday_reason || !start || !end ){
      noty({"text":"Please fill all information","layout":"top","type":"error"});
      return;
    }
    else if(start > end){
        noty({"text":"End time must be later than begin time!","layout":"top","type":"error"});
        return;
    }

    this.leave.holiday_type = formValue.modify.holiday_type;
    this.leave.holiday_reason = formValue.modify.holiday_reason;
    this.leave.holiday_time_begin = start;
    this.leave.holiday_time_end = end;
    // console.log(JSON.stringify(this.leave));
    this.userService.updateLeave(this.leave)
    .then(res => {
      noty({"text": 'Modify Successfully!', "layout":"top","type":"information"});
    })
    .catch(error => {
      noty({"text":"Something error!","layout":"top","type":"error"});
    });
    // location.reload(); //error!!!!
  }
}
