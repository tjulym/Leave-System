import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LeaveRoutingModule } from './leave-routing.module';
import { LeaveComponent } from './leave.component';
import { ApplyComponent } from './apply/apply.component';
import { DetailComponent } from './detail/detail.component';
import { ManageComponent } from './manage/manage.component';
import { PaginationBarModule } from '../pagination-bar/pagination-bar.module';
// import { PaginationBarComponent } from '../pagination-bar/pagination-bar.component';

@NgModule({
  imports: [
    CommonModule,
    LeaveRoutingModule,
    FormsModule,
    PaginationBarModule
  ],
  declarations: [LeaveComponent, ApplyComponent, DetailComponent, ManageComponent]
})
export class LeaveModule { }
