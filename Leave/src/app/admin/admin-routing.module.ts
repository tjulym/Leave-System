import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { AdminComponent } from './admin.component';
import { UserComponent } from './user/user.component';
import { LeaveComponent } from './leave/leave.component';
import { WorkaddComponent } from './workadd/workadd.component';
import { UseraddComponent } from './useradd/useradd.component';


const routes: Routes = [
    { 
        path: '',
        component: AdminComponent
    },
    {
        path: 'leave',
        component: LeaveComponent
    },
    {
        path: 'workadd',
        component: WorkaddComponent
    },
    {
        path: 'useradd',
        component: UseraddComponent
    }
];

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ]
})

export class AdminRoutingModule {}

