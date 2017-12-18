import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { WorkaddComponent } from './workadd.component';
import { WorkaddRoutingModule } from './workadd-routing.module';
import { ApplyComponent } from './apply/apply.component';
import { DetailComponent } from './detail/detail.component';
import { ManageComponent } from './manage/manage.component';
import { PaginationBarModule } from '../pagination-bar/pagination-bar.module';
// import { PaginationBarComponent } from '../pagination-bar/pagination-bar.component';


@NgModule({
  imports: [
    CommonModule,
    WorkaddRoutingModule,
    FormsModule,
    PaginationBarModule
  ],
  declarations: [WorkaddComponent, ApplyComponent, DetailComponent, ManageComponent]
})
export class WorkaddModule { }
