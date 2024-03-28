import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  admin = {
    email: '',
    password: ''
  }


  constructor( private auth: AuthService , private router: Router ) { }

  ngOnInit(): void {
  }

  token: any;

  login(){
    console.log(this.admin);
    
    this.auth.login( this.admin )
      .subscribe(
        res=>{
          console.log(res);
          this.token = res;
          localStorage.setItem( 'token' , this.token.myToken );
          
          this.router.navigate(['/admin']);
        },
        err=>{
          console.log(err);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Email or Password Invalid !',
          })
          
        }

      )

  }


}
