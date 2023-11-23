import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-myblogs',
  templateUrl: './myblogs.component.html',
  styleUrls: ['./myblogs.component.css']
})
export class MyblogsComponent implements OnInit {

  api_url = environment.api_url;
  data: any;
  blog_id_to_delete: any;
  blogs: any;

  constructor(
    private http: HttpClient,
    private spinner: NgxSpinnerService,

  ) { }

  ngOnInit(): void {
    const token = localStorage.getItem("access_key");
    // if (!token) {
    //   return;
    // }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    // this.http.get(
    //   this.api_url + "blogs/myblogs/", { "headers": headers }
    // ).subscribe((res) => {
    //   this.data = res;
    // });
    this.blogs = [
      {
        id: 1,
        blogname: "blog 1",
        description: "description for blog 1"
      },
      {
        id: 2,
        blogname: "blog 2",
        description: "description for blog 2"
      },
      {
        id: 3,
        blogname: "blog 3",
        description: "description for blog 3"
      },
      {
        id: 4,
        blogname: "blog 4",
        description: "description for blog 4"
      }
    ];
  }

  delete() {
    const token = localStorage.getItem("access_key");
    if (!token) {
      return;
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.delete(this.api_url + "blogs/blog/" + this.blog_id_to_delete, {"headers": headers}).subscribe((res) => {
      console.log(res);
      this.spinner.hide();
      Swal.fire(
        'Removed!',
        'Item removed successfully.',
        'success'
      );
      this.ngOnInit();
    })
  }

  confirmDeletion(blog_id) {
    this.blog_id_to_delete = blog_id;
    Swal.fire({
      title: 'Are you sure?',
      text: 'This process is irreversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, go ahead.',
      cancelButtonText: 'No, let me think',
    }).then((result) => {
      if (result.value) {
        console.log("confirm clicked")
        this.delete();
        Swal.close();
        this.spinner.show();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        console.log("denied")
        Swal.fire(
          'Cancelled',
          'Item is safe.',
          'error'
        )
      }
    })
  }

}
