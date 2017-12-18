//import angular core
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WorkaddComponent } from './workadd.component';
import { ApplyComponent } from './apply/apply.component';
import { ManageComponent } from './manage/manage.component';
//import my components
const routes: Routes = [
    {
        path: '',
        component: WorkaddComponent
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

export class WorkaddRoutingModule { }