import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  blog_id: string;
  api_url = environment.api_url;
  data: any;
  found: boolean;

  constructor(
    private activatedRoute : ActivatedRoute,
    private http: HttpClient,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    const token = localStorage.getItem("access_key");
    // if(!token) {
    //   return;
    // }
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`);
    this.spinner.show();
    this.blog_id = this.activatedRoute.snapshot.paramMap.get("blog_id");
    console.log(this.blog_id);
    this.http.get(
      this.api_url + "blogs/blog/" + this.blog_id, {"headers": headers}
    ).subscribe((res) => {
      this.data = res["message"];
      this.spinner.hide();
      this.found = true;
    },(err) => {
      console.log(err);
      this.spinner.hide();
      this.found = false;
    })
  }

}
