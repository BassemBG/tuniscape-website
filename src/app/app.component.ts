import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Tuniscape Production';

  isAdminRoute: boolean = false;
  isLoginRoute: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isAdminRoute = event.urlAfterRedirects.startsWith('/admin');
        this.isLoginRoute = event.urlAfterRedirects.startsWith('/login');
      }
    });
  }
}
