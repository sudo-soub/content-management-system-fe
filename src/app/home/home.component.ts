import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  username: string;
  data = [];

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.username = localStorage.getItem("username");
    if(!this.username) {
      this.router.navigateByUrl("login");
    }
    this.data = [
      {
        id: 1,
        title: "Machine Learning is Fun",
        author: "Adam Geitgey",
        description: "Machine Learning is Fun is a valuable, introductory blog. It covers the tenets of ML through interactive tutorials and\
        practical examples, which make it easier to see the useful applications to different businesses and industries. Author Adam Geitgey is a \
        former software developer who now consults organizations on implementing machine learning. He believes ML is integral to the future of \
        software and that developers should have a strong working knowledge, so he provides guides and techniques to help them develop and grow."
      },
      {
        id: 2,
        title: "Machine Learning Mastery",
        author: "Jason Brownlee",
        description: "A machine learning developer with several AI-related degrees, Jason intended his Machine Learning Mastery blog for new \
        developers getting started in the field. He was once an amateur developer and wants to help others, imparting lessons learned during his \
        professional journey and sharing the tools that helped him most. The blog, plus his email course and newsletter, accommodate any level of expertise."
      }
    ]
  }

  readMore(id: number){
    console.log(id);
  }

}
