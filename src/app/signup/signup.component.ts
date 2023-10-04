import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from "ngx-spinner";
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  verified: boolean = false;
  email: string;
  username: string;
  password: string;
  confirm_password: string;
  signupGroup: any;
  emailValidationGroup: any;
  emailSubmitted: boolean = false;
  signupDataSubmitted: boolean = false;
  userNameError: boolean;
  passWordError: boolean;
  emailError: boolean = false;
  verify_error: boolean;
  verify_error_message: string;
  user_error_message: string;
  password_message: string;
  login_response: any;
  token: string;
  api_url: string = environment.api_url;
  mail_sent: boolean = false;
  email_sent_msg: string;
  password_match: boolean = true;
  toggle: boolean = false;
  signup_success_message: string;


  validation_messages = {
    'email': [
      { type: 'required', message: 'This field is required!' },
      { type: 'pattern', message: 'Invalid Email address!' }
    ],
    'username': [
      { type: 'required', message: 'This field is required!' },
      { type: 'pattern', message: 'Invalid Username!' }
    ],
    'password': [
      { type: 'required', message: 'This field is required!' },
      { type: 'pattern', message: 'Invalid Password!' }
    ]
  };

  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.emailValidationGroup = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.pattern('^[A-za-z]{3,}[A-za-z0-9.]{1,}@[A-Za-z]{3,}.[A-Za-z.]{2,6}$')])
    });
    this.signupGroup = new FormGroup({
      'username': new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z]{1}[a-zA-Z0-9_]{2,15}$')]),
      'password': new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z][a-zA-Z0-9@#$%^&*]{7,32}$')]),
      'confirm_password': new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z][a-zA-Z0-9@#$%^&*]{7,32}$')])
    });
    this.activatedRoute.queryParams.subscribe((param) => {
      var urlToken = param['verify'];
      var decoded: any = jwt_decode(urlToken);
      let verifyEmail = localStorage.getItem("email");
      let verifyToken = localStorage.getItem("token");
      if (decoded['email'] == verifyEmail && decoded['token'] == verifyToken) {
        this.verified = true;
        this.emailSubmitted = false;
      }
    });
  }

  verifyEmail() {
    this.emailSubmitted = true;
    this.token = (Math.random() + 1).toString(32);
    const location = window.location.origin;
    if (this.emailValidationGroup.valid) {
      this.spinner.show();
      let body = {
        token: this.token,
        base_url: location,
        email: this.email
      }
      this.http.post(this.api_url + "common/verify-email/", body).subscribe((res) => {
        console.log(res['status']);
        this.emailSubmitted = false;
        this.mail_sent = true;
        this.email_sent_msg = res['message'];
        localStorage.setItem("email", this.email);
        localStorage.setItem("token", this.token);
        this.spinner.hide();
      },
        (err) => {
          console.log(err)
          this.spinner.hide();
          this.verify_error = true;
          this.verify_error_message = err['error']['error'];
        });
    }
  }

  emailChange() {
    this.emailSubmitted = false;
    this.verify_error = false;
  }

  usernameChange() {
    this.userNameError = false;
  }

  passwordChange() {
    this.passWordError = false;
    this.password_match = true;
  }

  togglePasswordVisibility() {
    this.toggle = !this.toggle;
    let ele = document.getElementsByName("confirmPassord")[0];
    if (this.toggle) {
      ele["type"] = "text";
    }
    else {
      ele["type"] = "password";
    }
  }

  signup() {

    if (this.signupGroup.invalid) {
      console.log(this.signupGroup);
      return;
    }

    if (this.password != this.confirm_password) {
      this.password_match = false;
      return;
    }

    this.signupDataSubmitted = true;
    this.spinner.show();
    console.log(this.signupGroup);
    let email = localStorage.getItem("email");
    let body = {
      email: email,
      username: this.username,
      password: this.password
    }
    this.http.post(this.api_url + "common/create-account/", body).subscribe((res) => {
      console.log(res);
      this.signup_success_message = res['message'];
      this.spinner.hide();
      let modal = document.getElementById("modal-container");
      modal.removeAttribute("class");
      modal.classList.add("one");
      document.body.classList.add("modal-active");

      setTimeout(() => {
        modal.classList.add("out");
        document.body.classList.remove("modal-active");
        this.router.navigateByUrl("login");
        localStorage.clear();
      }, 3000);

    },(err) => {
      this.spinner.hide();
      console.log(err);
      if(err["error"]["type"] == 2) {
        this.userNameError = true;
        this.user_error_message = err["error"]["error"];
      }
    });

  }

}
