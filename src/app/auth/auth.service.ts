import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  api_url: string = environment.api_url;

  get isLoggedIn() {
    const expiration = localStorage.getItem('access_key_expired');
    if (!expiration) {
      console.log("expiration key not found");
      return this.loggedIn.asObservable();
    }
    const expirationDate = Date.parse(expiration);
    const isExpired = Date.now() > expirationDate;
    if (isExpired) {
      console.log("key expired");
      this.refreshToken();
      const refreshedExpiration = localStorage.getItem('access_key_expired');
      console.log("refreshed expiry", refreshedExpiration);
      if (!refreshedExpiration) {
        console.log("refreshed expiration not found");
        return this.loggedIn.asObservable();
      }
    }
    else {
      console.log("not expired");
      this.loggedIn.next(true);
    }
    return this.loggedIn.asObservable();
  }

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  private refreshToken() {
    const accessKey = localStorage.getItem('access_key');
    const refreshKey = localStorage.getItem('refresh_key');
    const user = localStorage.getItem('username');

    if (!accessKey || !refreshKey) {
      return;
    }

    localStorage.clear();
    console.log("cleared");
    const refreshTokenInfo = {
      access_key: accessKey,
      refresh_key: refreshKey,
      username: user
    };
    const requestUrl = `${environment.api_url}common/refresh-key`;
    this.http.post(requestUrl, refreshTokenInfo).subscribe({
      next: (data) => {
        this.setSession(data);
        console.log("api called to refresh");
      },
      error: (err) => {
        console.log("error refreshing token");
        console.log(err);
        this.logout();
      },
    });
  }

  login(body) {
    return this.http.post(this.api_url + "common/user-login/", body);
  }

  setSession(session) {
    localStorage.setItem("access_key", session["access_key"]);
    localStorage.setItem("access_key_expired", session["access_key_expired"]);
    localStorage.setItem("refresh_key", session["refresh_key"]);
    localStorage.setItem("refresh_key_expired", session["refresh_key_expired"]);
    localStorage.setItem("username", session["username"]);
  }

  logout():any {
    localStorage.clear();
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }
}
