import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Input } from '@angular/core';
import { Router } from '@angular/router';

import { WorkaddDetail } from '../../domain/workadd-detail';
import { WorkaddInfo } from '../../domain/workadd-info';
import { AdminService } from '../../service/admin.service';

@Component({
  selector: 'app-workadd-detail',
  templateUrl: './workadd-detail.component.html',
  styleUrls: ['./workadd-detail.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [AdminService]
})
export class WorkaddDetailComponent implements OnInit {
  
  @Input() workadd: WorkaddDetail;
  @Input() options: WorkaddInfo[];

  constructor(
    private adminService: AdminService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onSubmit(formValue) {
    let start = $("#workadd_start").val();
    let end = $("#workadd_end").val();
    // console.log(formValue.modify.workadd_type)
    // console.log(formValue.modify.workadd_reason)
    // console.log(start)
    // console.log(end)

    if(!formValue.modify.workadd_type || !formValue.modify.workadd_type || !start || !end ){
      noty({"text":"Please fill all information","layout":"top","type":"error"});
      return;
    }

    else if(start > end){
        noty({"text":"End time must be later than begin time!","layout":"top","type":"error"});
        return;
    }

    this.workadd.workadd_type = formValue.modify.workadd_type;
    this.workadd.workadd_reason = formValue.modify.workadd_reason;
    this.workadd.workadd_start = start;
    this.workadd.workadd_end = end;
    // console.log(JSON.stringify(this.workadd));
    console.log(this.workadd.workadd_reason);
    this.adminService.updateWorkadd(this.workadd)
    .then(res => {
      noty({"text": res['message'], "layout":"top","type":(res['error']? "error": "information")});
      this.router.navigate(['/admin/workadd']);
      location.reload();
    })
    .catch(error => {
      noty({"text":"Something error!","layout":"top","type":"error"});
      this.router.navigate(['/admin/workadd']);
      location.reload();
    });

  }
}
