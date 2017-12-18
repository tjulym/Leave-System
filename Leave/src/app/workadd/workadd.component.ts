import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { CommonService } from '../service/common.service';
import { UserService } from '../service/user.service';
import { WorkaddDetail } from '../domain/workadd-detail';
import { WorkaddInfo } from '../domain/workadd-info';

@Component({
  selector: 'app-workadd',
  templateUrl: './workadd.component.html',
  styleUrls: ['./workadd.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [CommonService, UserService]
})
export class WorkaddComponent implements OnInit {

  columns = [ '编号', '开始时间', '结束时间', '加班类型', 
  '加班原因', '申请状态', '申请时间', '操作'];
  dataList: WorkaddDetail[];
  options: WorkaddInfo[];
  page: number = 1;
  per_page: number = 10;
  total_page_num: number;
  selectedWorkadd: WorkaddDetail
  = {
    workadd_add_state: 1,
    workadd_apply_time: '0',
    workadd_id: 1,
    workadd_info_id: 1,
    workadd_reason: '1',
    workadd_start: '0',
    workadd_end: '0',
    workadd_type: 1,
    workadd_worker_id: '1'
  };

  constructor(
    private commomService: CommonService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.commomService.getWorkaddInfo()
      .then(infos => {
        this.options = infos;
          this.init();
      } )
  }

  init() {
    this.userService.getWorkaddDetail(this.page, this.per_page)
    .then(res => {
      this.dataList = res.workadds as WorkaddDetail[];
      // $('#pagination-demo').twbsPagination('destroy');
      this.total_page_num = res.total_page_num;   
    });

    console.log(this.page);
  }

  freshList(event) {
    this.page = event.currentPage;
    this.per_page = event.itemsPerPage;
    this.init();
  }

  loadWorkadd(workadd: WorkaddDetail) {
    this.selectedWorkadd = workadd;
    $("#workadd_modal").modal("show");
    $(".form_datetime").datetimepicker({format: 'yyyy-mm-dd hh:ii:ss'});
  }

  
  overWorkadd(workadd: WorkaddDetail) {
    this.selectedWorkadd = workadd;
    let t = Object.assign({}, this.selectedWorkadd, {'workadd_over': '-1'});
    console.log(t);
    this.userService.cancelWorkadd(t)
      .then(res => {
        noty({"text": "You cancel your workadd", "layout":"top","type": res['error']? "error": "information"});
        this.init();
      })
      .catch(error => {
        noty({"text": "Error Action!", "layout":"top","type":"error"});
        this.init();
      });
      
    
  }

  getWorkaddState(state: number) {
    if(state == 0)
      return "待审核";
    else if(state == 1)
      return "已通过";
    else if(state == -1)
      return "已失效";
  }

  getWorkaddLabel(state: number) {
    if(state == 1)
      return ['label-success'];
    else if(state == 0)
      return ['label-warning'];
    else
      return ['label-danger'];
  }
}
