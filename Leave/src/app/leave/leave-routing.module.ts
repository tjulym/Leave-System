//import angular core
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//import my components
import { LeaveComponent } from './leave.component';
import { ApplyComponent } from './apply/apply.component';
import { ManageComponent } from './manage/manage.component';
const routes: Routes = [
    {
        path: '',
        component: LeaveComponent
    },
    {
        path: 'apply',
        component: ApplyComponent
    },
    {
        path: 'manage',
        component: ManageComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class LeaveRoutingModule { }