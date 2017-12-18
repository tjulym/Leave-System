import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';


import { CommonService } from '../../service/common.service';
import { UserService } from '../../service/user.service';
import { WorkaddInfo } from '../../domain/workadd-info';
import { Workadd } from '../../domain/workadd';

@Component({
  selector: 'app-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [CommonService, UserService]
})
export class ApplyComponent implements OnInit {

  options: WorkaddInfo[];

  constructor(
    private commomService: CommonService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    $(".form_datetime").datetimepicker({format: 'yyyy-mm-dd hh:ii:ss'});
    this.commomService.getWorkaddInfo()
      .then(infos => this.options = infos);
  }
  
  onSubmit(formValue) {
    let start = $("#workadd_start").val();
    let end = $("#workadd_end").val();
    
    if(!formValue.apply.workadd_type || !formValue.apply.workadd_reason || !start || !end ){
      noty({"text":"Please fill all information","layout":"top","type":"error"});
      return;
    }
    else if(start > end){
        noty({"text":"End time must be later than begin time!","layout":"top","type":"error"});
        return;
    }

    let workadd: Workadd = {
      workadd_type: formValue.apply.workadd_type,
      workadd_start: start,
      workadd_end: end,
      workadd_reason: formValue.apply.workadd_reason
    }

    this.userService.applyWorkadd(workadd)
      .then(res => {
        noty({"text": 'Apply Successfully!', "layout":"top","type":"information"});
        this.router.navigate(['/workadd']);
        location.reload();
      })
      .catch(error => {
        noty({"text":"Something error!","layout":"top","type":"error"});
      });
    
  }
}
