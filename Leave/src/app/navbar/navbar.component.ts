import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent implements OnInit {

  user: string;
  show: boolean;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    if(sessionStorage.getItem("user") !== null){
      this.user = sessionStorage.getItem("user");
      this.show = true;
    }
    else{
      this.show = false;
    }
  }

  logout() {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    this.user = "none";
    this.show = false;
    this.router.navigate(['/login']);
    location.reload();
  }
}
