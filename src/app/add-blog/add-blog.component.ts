import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from "../../environments/environment";
import { NgxSpinnerService } from "ngx-spinner";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-add-blog',
  templateUrl: './add-blog.component.html',
  styleUrls: ['./add-blog.component.css']
})
export class AddBlogComponent implements OnInit {

  add_image: boolean;
  image_uploaded: boolean;
  filename: string = "File Name";
  file: File;
  file_format_error: boolean;
  preview: boolean;
  image_src: string | ArrayBuffer;
  title: string;
  description: string;
  article_body: string;
  freeimage_url: string = environment.req_url;
  freeimage_key: string = environment.req_key;

  constructor(
    private http: HttpClient,
    private spinner: NgxSpinnerService,

  ) { }

  ngOnInit(): void {
  }

  addImage(e) {
    if (e.target.checked) {
      this.add_image = true;
    }
    else {
      this.add_image = false;
    }
  }

  getImageDetails(e) {
    if (e.target.files && e.target.files[0]) {
      this.file = e.target.files[0];
      this.filename = this.file.name;
      if (this.file.type != "image/jpeg") {
        console.log(this.file.type);
        this.file_format_error = true;
        return;
      }
      else {
        this.file_format_error = false;
        this.preview = true;
        var reader = new FileReader();
        reader.readAsDataURL(this.file);
        reader.onload = (e) => {
          this.image_src = e.target.result;
        }
      }
    }
  }

  uploadImage() {
    this.spinner.show();
    const headers = new HttpHeaders();
    headers.set("Access-Control-Allow-Origin", "*");
    const form_data = new FormData();
    form_data.append("key", this.freeimage_key);
    form_data.append("source", this.file);
    this.http.post(this.freeimage_url, form_data, {"headers": headers}).subscribe((res) => {
      console.log("success");
      console.log(res);
      this.spinner.hide();
    },(err) => {
      console.log("error");
      console.log(err);
      this.spinner.hide();
    });
  }

}
