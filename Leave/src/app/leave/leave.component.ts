import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router ,ActivatedRoute, Params} from '@angular/router';

import { CommonService } from '../service/common.service';
import { UserService } from '../service/user.service';
import { LeaveDetail } from '../domain/leave-detail';
import { HolidayInfo } from '../domain/holiday-info';

@Component({
  selector: 'app-leave',
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [CommonService, UserService]
})
export class LeaveComponent implements OnInit {

  columns = [ '编号', '开始时间', '结束时间', '请假类型', 
    '请假原因', '请假状态', '申请时间', '操作'];
  dataList: LeaveDetail[];
  options: HolidayInfo[];
  page: number = 1;
  per_page: number = 10;
  total_page_num: number;
  selectedLeave: LeaveDetail
  = {
    holiday_app_end: false,
    holiday_app_over: false,
    holiday_apply_ok: 1,
    holiday_apply_state: 1,
    holiday_apply_time: '0',
    holiday_end_time: '0',
    holiday_id: 1,
    holiday_reason: '1',
    holiday_time_begin: '0',
    holiday_time_end: '0',
    holiday_type: 1,
    holiday_worker_id: '1'
  };

  constructor(
    private commomService: CommonService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
    ) { }

  ngOnInit() {

    this.commomService.getHolidayInfo()
      .then(infos => {
        this.options = infos;
          this.init();
      } );
  }

  init() {
    this.userService.getLeaveDetail(this.page, this.per_page)
    .then(res => {
      this.dataList = res.holidays as LeaveDetail[];
      this.total_page_num = res.total_page_num;
      // if(this.pageBar)
      //   this.pageBar.pageList = [1];
    });

    console.log(this.page);
  }

  freshList(event) {
    this.page = event.currentPage;
    this.per_page = event.itemsPerPage;
    this.init();
  }

  loadLeave(leave: LeaveDetail) {
    this.selectedLeave = leave;
    $("#holiday_modal").modal("show");
    $(".form_datetime").datetimepicker({format: 'yyyy-mm-dd hh:ii:ss'});
    // console.log(this.selectedLeave);
  }

  overLeave(leave: LeaveDetail) {
    this.selectedLeave = leave;
    let t = Object.assign({}, this.selectedLeave, {'holiday_end': 1});
    console.log(t);
    this.userService.overLeave(t)
      .then(res => {
        noty({"text": res['message'], "layout":"top","type": res['error']? "error": "information"});
        this.init();
      })
      .catch(error => {
        noty({"text": "Error Action!", "layout":"top","type":"error"});
        this.init();
      });
    
  }

  endLeave(leave: LeaveDetail) {
    this.selectedLeave = leave;
    let t = Object.assign({}, this.selectedLeave, {'holiday_over': 1});
    console.log(t);
    this.userService.endLeave(t)
      .then(res => {
        noty({"text": res['message'], "layout":"top","type": res['error']? "error": "information"});
        this.init();
      })
      .catch(error => {
        noty({"text": "Error Action!", "layout":"top","type":"error"});
        this.init();
      });
    
  }

  reinit(){
    
    console.log(this.page);
    console.log(this.per_page);
    let t = document.getElementById("t");
    console.log(t.getAttribute("text"));
  }

  getState(end: boolean, over: boolean, ok: number, state: number): string {
    if(over){
       return end?"已结束":"已撤销";        
     }
     else{
        if(ok == 1)
          if(end)
            return "待销假";
          else
            return "已通过";
        else if(ok == 0)
          if(state == -1)
            return "已驳回";
          else
            return (state+1) + "级审批";
        else
          return "已驳回";
     }
  }

  getLabel(end: boolean, over: boolean, ok: number, state: number) {
    if(over){
       return []        
     }
     else{
        if(ok == 1)
          if(end)
            return ['label-warning'];
          else
            return ['label-success'];
        else if(ok == 0)
          if(state == -1)
            return ['label-danger'];
          else
            return ['label-warning'];
        else
          return ['label-danger'];
     }
  }
}
