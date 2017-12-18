import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Input } from '@angular/core';

import { UserService } from '../../service/user.service';
import { WorkaddDetail } from '../../domain/workadd-detail';
import { WorkaddInfo } from '../../domain/workadd-info';


@Component({
  selector: 'workadd-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [UserService]
})
export class DetailComponent implements OnInit {

  @Input() workadd: WorkaddDetail;
  @Input() options: WorkaddInfo[];
  @Input() ban: boolean;

  constructor(
    private userService: UserService
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
    this.userService.updateWorkadd(this.workadd)
    .then(res => {
      noty({"text": 'Modify Successfully!', "layout":"top","type":"information"});
    })
    .catch(error => {
      noty({"text":"Something error!","layout":"top","type":"error"});
    });
    // location.reload(); //error!!!!
  }

}
