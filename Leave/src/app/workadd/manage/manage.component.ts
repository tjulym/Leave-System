import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { CommonService } from '../../service/common.service';
import { UserService } from '../../service/user.service';
import { WorkaddDetail } from '../../domain/workadd-detail';
import { WorkaddInfo } from '../../domain/workadd-info';


@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [CommonService, UserService]
})
export class ManageComponent implements OnInit {

  columns = [ '编号', '工号', '开始时间', '结束时间', '加班类型', 
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
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.commomService.getWorkaddInfo()
      .then(infos => {
        this.options = infos;
          this.init();
      } );
  }

  init() {
    this.userService.getManageWorkaddDetail(this.page, this.per_page)
      .then(res => {
        this.dataList = res.workadds as WorkaddDetail[];
        // $('#pagination-demo').twbsPagination('destroy');
        this.total_page_num = Math.ceil(this.dataList.length / this.per_page);
            
      })
      .catch(error => {
        noty({"text": "Insufficient permissions", "layout":"top","type":"error"});
        this.router.navigate(['/workadd']);
        location.reload();
      })
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
    // console.log(this.selectedLeave);
  }

  operWorkadd(workadd: WorkaddDetail, workadd_ok: string) {
    this.selectedWorkadd = workadd;
   
    let t = Object.assign({}, this.selectedWorkadd, {'workadd_ok': workadd_ok});    
    
    // console.log(t);
    this.userService.operWorkadd(t)
      .then(res => {
        noty({"text": "Operation Successfully!", "layout":"top","type": res['error']? "error": "information"});
        this.init();
      })
      .catch(error => {
        noty({"text": "Error Action!", "layout":"top","type":"error"});
        this.init();
      })
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
