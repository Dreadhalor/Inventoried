import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Globals } from './../globals';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedIn = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.setLoggedIn(false);
  }

  getHeaders(){
    let headers = new HttpHeaders({
      authorization: localStorage.getItem('authorization')
    })
    return headers;
  }

  setLoggedIn(redirect: boolean){
    this.loggedIn = !!localStorage.getItem('authorization');
    if (redirect){
      if (this.loggedIn) this.router.navigateByUrl('/browse-assets');
      else this.router.navigateByUrl('/login');
    }
  }

  logIn(user: string, pass: string){
    return this.authenticate(user, pass)
      .then((authenticated: any) => {
        let token = authenticated.result;
        localStorage.setItem('authorization',token);
        this.setLoggedIn(true);
        return authenticated;
      }
    )
  }
  logOut(){
    localStorage.removeItem('authorization');
    this.setLoggedIn(true);
  }

  authenticate(user: string, pass: string){
    let body = {
      username: user,
      password: pass
    }
    return new Promise((resolve, reject) => {
      this.http.post(Globals.request_prefix + 'users/authenticate', body).subscribe(
        (authentication: any) => {
          if (authentication.error) reject(authentication);
          resolve(authentication)
        },
        (error) => reject({error: error})
      )
    })
  }

}
