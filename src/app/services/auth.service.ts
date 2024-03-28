import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  url = this.apiBaseUrl + 'admin/';

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject('API_BASE_URL') private apiBaseUrl: string
  ) {}

  login(adm: any) {
    return this.http.post(this.url + 'login', adm);
  }

  register(adm: any) {
    return this.http.post(this.url + 'register', adm);
  }

  isLoggedIn() {
    let token = localStorage.getItem('token');

    if (token) {
      return true;
    } else {
      return false;
    }
  }

  logOut() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  getDataFromToken() {
    let token = localStorage.getItem('token');

    if (token) {
      let data = JSON.parse(window.atob(token.split('.')[1]));

      return data;
    }
  }
}
