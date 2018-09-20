import { HttpClient } from '@angular/common/http';
import { Globals } from './../globals';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as jwt from '@auth0/angular-jwt';

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

  setLoggedIn(redirect: boolean){
    this.loggedIn = !!localStorage.getItem('authorization');
    if (redirect){
      if (this.loggedIn) this.router.navigateByUrl('/browse-assets');
      else this.router.navigateByUrl('/login');
    }
  }

  logIn(user: string, pass: string){
    return this.authenticate(user, pass)
      .then((token: string) => {
        localStorage.setItem('authorization', token);
        this.setLoggedIn(true);
        return token;
      })
      .catch(error => console.log(error))
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
      this.http.post(Globals.request_prefix + 'users/authenticate', body)
        .subscribe(
          authenticated => resolve(authenticated),
          error => reject(error)
        )
    })
  }

}
