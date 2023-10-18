import { Component, OnInit, ViewChild } from '@angular/core';

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

  constructor() { }

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

  }

}
