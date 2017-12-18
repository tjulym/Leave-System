import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { AdminService } from '../../service/admin.service';
import { LeaveDetail } from '../../domain/leave-detail';
import { HolidayInfo } from '../../domain/holiday-info';

@Component({
  selector: 'app-leave',
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [AdminService]
})
export class LeaveComponent implements OnInit {

  columns = [ '编号', '工号', '开始时间', '结束时间', '请假类型', 
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

  params: Object = {};

  constructor(
    private adminService: AdminService,
    private router: Router
  ) { }

  ngOnInit() {
    this.adminService.getLeaveInfo()
      .then(info => {
        this.options = info;
        this.init();
      })
  }

  init() {
    this.adminService.getLeaveDetail(this.params)
      .then(res => {
        let tmp = res.holidays as LeaveDetail[];
        this.dataList = [];
        for (let i = (this.page - 1) * this.per_page; i < this.page * this.per_page; i++) { 
          if(tmp[i])
            this.dataList.push(tmp[i]); 
        }
        // $('#pagination-demo').twbsPagination('destroy');
        this.total_page_num = Math.ceil(tmp.length / this.per_page);
      })
      .catch(error => {
        noty({"text": "Something error", "layout":"top","type":"error"});
      })
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

  manageLeave(leave: LeaveDetail) {
    this.selectedLeave = leave;
    $("#state_modal").modal("show");
    $(".form_datetime").datetimepicker({format: 'yyyy-mm-dd hh:ii:ss'});
  }

  overLeave(leave: LeaveDetail) {
    this.selectedLeave = leave;
    this.adminService.overLeave(this.selectedLeave.holiday_id)
      .then(res => {
        noty({"text": res['message'], "layout":"top","type":(res['error']? "error": "information")});
      })
      .catch(error => {
        noty({"text":"Something error!","layout":"top","type":"error"});
      });
    
      this.router.navigate(['/admin/leave']);
      location.reload();
  }

  showFilter() {
    $('#filter_modal').modal('show');
    $(".form_datetime").datetimepicker({format: 'yyyy-mm-dd hh:ii:ss'});
  }

  clearFilter() {
    this.params = {};
    this.router.navigate(['/admin/leave']);
    location.reload();
  }

  filterChange(formValue) {
    this.params = {}
    this.page = 1;
    this.per_page = 10;

    for (let k in formValue.filter) {
      if(formValue.filter[k])
        this.params[k] = formValue.filter[k];
    }

    let start = $("#search_begin").val();
    let end = $("#search_end").val();

    if(start)
      this.params['search_begin'] = start;
    if(end)
      this.params['search_end'] = end;
    
    if(end < start){
      noty({"text":"End time must be later than begin time!","layout":"top","type":"error"});
      return;
    }

    this.init();
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
