import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from "ngx-spinner";

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
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {}

  login() {
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
    this.http.post(this.api_url + "common/user-login/", body).subscribe((res) => {
      console.log(res);
      this.spinner.hide();
      localStorage.setItem("username", this.username);
      this.router.navigateByUrl("home");
    }, (err) => {
      this.spinner.hide();
      this.login_error = true;
      this.login_error_message = err["error"]["error"];
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
