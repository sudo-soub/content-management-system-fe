import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from "ngx-spinner";

import { AuthService } from "../auth/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  api_url: string = environment.api_url;
  username: string;
  password: string;
  login_error: boolean = false;
  login_error_message: string;
  toggle: boolean = false;
  username_error: boolean = false;
  password_error: boolean = false;
  required_message: string = "This field is required!";

  constructor(
    private http: HttpClient,
    private router: Router,
    private spinner: NgxSpinnerService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {}

  submit() {
    if(!this.username) {
      this.username_error = true;
      return;
    }
    if(!this.password) {
      this.password_error = true;
      return;
    }
    let body = {
      username: this.username,
      password: this.password
    }
    this.spinner.show();
    this.authService.login(body).subscribe((res) => {
      this.authService.loggedIn.next(true);
      this.spinner.hide();
      this.router.navigateByUrl("home");
      console.log(res);
    },
    (err) => {
      this.spinner.hide();
      this.login_error = true;
      this.login_error_message = err["error"]["error"];
      console.log(err);
    });
  }

  togglePasswordVisibility() {
    this.toggle = !this.toggle;
    let ele = document.getElementsByName("password")[0];
    if (this.toggle) {
      ele["type"] = "text";
    }
    else {
      ele["type"] = "password";
    }
  }

  usernameChange() {
    this.login_error = false;
    this.username_error = false;
  }

  passwordChange() {
    this.login_error = false;
    this.password_error = false;
  }

  gotoSignup() {
    this.router.navigateByUrl('signup');
  }

}
