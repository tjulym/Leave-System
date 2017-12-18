import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuardService } from './service/auth-guard.service';

import { LoginComponent } from './login/login.component';

import { ProfileModule } from './profile/profile.module';
import { ProfileComponent } from './profile/profile.component';
import { AdminGuardService } from './service/admin-guard.service';


const routes: Routes = [
    { path: '', redirectTo: '/profile', pathMatch: 'full'},
    { 
        path: 'profile',
        // component: ProfileComponent
        canActivate: [AuthGuardService], 
        loadChildren: 'app/profile/profile.module#ProfileModule'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'leave',
        canActivate: [AuthGuardService],
        loadChildren: 'app/leave/leave.module#LeaveModule'
    },
    {
        path: 'workadd',
        canActivate: [AuthGuardService],
        loadChildren: 'app/workadd/workadd.module#WorkaddModule'
    },
    {
        path: 'admin',
        canActivate: [AdminGuardService],
        loadChildren: 'app/admin/admin.module#AdminModule'
    }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})

export class AppRoutingModule {}

