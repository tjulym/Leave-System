import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

import { AppRoutingModule } from './app-routing.module';
import { HttpModule } from '@angular/http';
import { ProfileModule } from './profile/profile.module';
import { CoreModule } from './core/core.module';

import { ApiService } from './service/api.service';
import { NavbarComponent } from './navbar/navbar.component';
import { LeaveModule } from './leave/leave.module';
// import { WorkaddComponent } from './workadd/workadd.component';
import { WorkaddModule } from './workadd/workadd.module';
// import { AdminComponent } from './admin/admin.component';
import { AdminModule } from './admin/admin.module';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    // PaginationBarComponent,
    // AdminComponent,
    // WorkaddComponent,
    // ProfileComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpModule,
    ProfileModule,
    CoreModule,
    LeaveModule,
    WorkaddModule,
    AdminModule
  ],
  providers: [ ApiService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
