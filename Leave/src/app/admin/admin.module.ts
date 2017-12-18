import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { UserComponent } from './user/user.component';
import { LeaveComponent } from './leave/leave.component';
import { WorkaddComponent } from './workadd/workadd.component';
import { PasswdComponent } from './passwd/passwd.component';
import { UseraddComponent } from './useradd/useradd.component';
import { PermitComponent } from './permit/permit.component';
import { PaginationBarModule } from '../pagination-bar/pagination-bar.module';
import { LeaveDetailComponent } from './leave-detail/leave-detail.component';
import { LeaveStateComponent } from './leave-state/leave-state.component';
import { WorkaddDetailComponent } from './workadd-detail/workadd-detail.component';


@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    PaginationBarModule
  ],
  declarations: [AdminComponent, UserComponent, LeaveComponent, WorkaddComponent, PasswdComponent, UseraddComponent, PermitComponent, LeaveDetailComponent, LeaveStateComponent, WorkaddDetailComponent]
})
export class AdminModule { }
