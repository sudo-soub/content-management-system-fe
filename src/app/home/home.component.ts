import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  username: string;
  data: any = [];
  is_logged_in: boolean;
  api_url = environment.api_url;

  constructor(
    private router: Router,
    private authService: AuthService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    const token = localStorage.getItem("access_key");
    // if (!token) {
    //   return;
    // }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    // this.http.get(this.api_url + "blogs/blog", {headers: headers}).subscribe((res) => {
    //   this.data = res["message"];
    // });
    
  }

  readMore(id: number){
    this.router.navigateByUrl("blog/" + id);
  }

}
