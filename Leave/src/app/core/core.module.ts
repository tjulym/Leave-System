import { NgModule, ModuleWithProviders, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService } from '../service/auth.service';
import { UserService } from '../service/user.service';
import { AuthGuardService } from '../service/auth-guard.service';
import { AdminGuardService } from '../service/admin-guard.service';
import { AdminService } from '../service/admin.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    { provide: 'auth', useClass: AuthService },
    { provide: 'user', useClass: UserService },
    AuthGuardService,
    AdminGuardService,
    AdminService
  ]
})
export class CoreModule { 
  constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
    if(parentModule){
      throw new Error('CoreModule is already loaded.');
    }
  }
}
