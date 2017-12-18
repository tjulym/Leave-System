import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';


import { AdminService } from '../../service/admin.service';
import { WorkaddDetail } from '../../domain/workadd-detail';
import { WorkaddInfo } from '../../domain/workadd-info';

@Component({
  selector: 'app-workadd',
  templateUrl: './workadd.component.html',
  styleUrls: ['./workadd.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [AdminService]
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

  params: Object = {};

  constructor(
    private adminService: AdminService,
    private router: Router
  ) { }

  ngOnInit() {
    this.adminService.getWorkaddInfo()
    .then(infos => {
        this.options = infos;
        this.init();
    } )
  }

  init() {
    this.adminService.getWorkaddDetail(this.params)
    .then(res => {
      let tmp = res.workadds as WorkaddDetail[];
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

  operWorkadd(workadd: WorkaddDetail, workadd_ok: string) {
    this.selectedWorkadd = workadd;
   
    let t = Object.assign({}, this.selectedWorkadd, {'workadd_state': workadd_ok});    
    
    // console.log(t);
    this.adminService.operWorkadd(t)
      .then(res => {
        noty({"text": res['message'], "layout":"top","type":(res['error']? "error": "information")});
        this.init();
      })
      .catch(error => {
        noty({"text": "Error Action!", "layout":"top","type":"error"});
        this.init();
      })
  }

  showFilter() {
    $('#filter_modal').modal('show');
    $(".form_datetime").datetimepicker({format: 'yyyy-mm-dd hh:ii:ss'});
  }

  clearFilter() {
    this.params = {};
    this.router.navigate(['/admin/workadd']);
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
