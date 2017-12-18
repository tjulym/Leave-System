import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProfileComponent } from './profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileModifyComponent } from './profile-modify/profile-modify.component';
import { PasswordModifyComponent } from './password-modify/password-modify.component';


@NgModule({
  imports: [
    CommonModule,
    ProfileRoutingModule,
    FormsModule
  ],
  declarations: [ProfileComponent, ProfileModifyComponent, PasswordModifyComponent]
})
export class ProfileModule { }
