//import angular core
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//import my components
import { ProfileComponent } from './profile.component'; 
import { ProfileModifyComponent } from './profile-modify/profile-modify.component';
import { PasswordModifyComponent } from './password-modify/password-modify.component';
const routes: Routes = [
    {
        path: '',
        component: ProfileComponent
    },
    {
        path: 'profile-modify',
        component: ProfileModifyComponent
    },
    {
        path: 'password-modify',
        component: PasswordModifyComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ProfileRoutingModule { }