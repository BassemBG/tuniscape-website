import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  isScrolled: boolean = false;
  isMenuOpen = false;
  isHomeComponent: boolean = false;


  constructor(private auth: AuthService) { }

  ngOnInit(): void {
  }

  logOut(){
    this.auth.logOut();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    console.log(this.isMenuOpen);
  }

  closeMenu() {
    this.isMenuOpen = false;
  }



}
