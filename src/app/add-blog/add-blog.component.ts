import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-blog',
  templateUrl: './add-blog.component.html',
  styleUrls: ['./add-blog.component.css']
})
export class AddBlogComponent implements OnInit {

  is_logged_in: boolean;
  api_url: string = environment.api_url;
  title: string;
  blogdata: any;
  submit_error: boolean = false;
  submit_error_message: string = "";
  tinymce_key = environment.tinymce_key;
  init = {
    plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount preview',
    toolbar: [
      'undo redo | formatselect fontselect fontsizeselect forecolor | style_fontsize | bold italic underline strikethrough | link image media table',
      'emoticons charmap removeformat | alignleft aligncenter alignright alignjustify lineheight | numlist bullist indent outdent'
    ],
    height: 500,
    placeholder: "Start sharing your ideas here......"
  }

  constructor(
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private router: Router,

  ) { }

  ngOnInit(): void {
  }

  editorChanges() {
    this.submit_error = false;
  }
  
  submit() {
    console.log("submitted");
    const token = localStorage.getItem("access_key");
    // if (!token) {
    //   return;
    // }
    if(!this.blogdata) {
      this.submit_error = true;
      this.submit_error_message = "Share some data with us......"
      return;
    }
    console.log(this.blogdata);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = {
      user: localStorage.getItem("username"),
      blogname: this.title,
      blog_data: this.blogdata
    };
    const req_url = this.api_url + "blogs/blog";
    this.http.post(req_url, body, { "headers": headers }).subscribe((res) => {
      console.log(res);
    },
    (err) => {
      console.log(err);
    });
  }

}
