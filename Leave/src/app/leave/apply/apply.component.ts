import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { HolidayInfo } from '../../domain/holiday-info';
import { Leave } from '../../domain/leave';

import { CommonService } from '../../service/common.service';
import { UserService } from '../../service/user.service';



@Component({
  selector: 'app-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [CommonService, UserService]
})
export class ApplyComponent implements OnInit {

  options: HolidayInfo[];
  
  constructor(
    private commomService: CommonService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    $(".form_datetime").datetimepicker({format: 'yyyy-mm-dd hh:ii:ss'});
    this.commomService.getHolidayInfo()
      .then(infos => this.options = infos);
  }

  onSubmit(formValue) {
    let start = $("#holiday_time_begin").val();
    let end = $("#holiday_time_end").val();
    
    if(!formValue.apply.holiday_type || !formValue.apply.holiday_reason || !start || !end ){
      noty({"text":"Please fill all information","layout":"top","type":"error"});
      return;
    }
    else if(start > end){
        noty({"text":"End time must be later than begin time!","layout":"top","type":"error"});
        return;
    }

    let leave: Leave = {
      holiday_type: formValue.apply.holiday_type,
      holiday_time_begin: start,
      holiday_time_end: end,
      holiday_reason: formValue.apply.holiday_reason
    }

    this.userService.applyLeave(leave)
      .then(res => {
        noty({"text": 'Apply Successfully!', "layout":"top","type":"information"});
        this.router.navigate(['/leave'])
        location.reload();
      })
      .catch(error => {
        noty({"text":"Something error!","layout":"top","type":"error"});
      });
    
  }

}
